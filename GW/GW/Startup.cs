using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using FluentValidation.AspNetCore;
using GW.Application.Interfaces;
using GW.Application.Roles;
using GW.Application.Users.Queries;
using GW.Domain.Entities;
using GW.Extensions;
using GW.Models;
using GW.Persistence;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Serilog;

namespace GW
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
            Configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json")
            .AddJsonFile("appsettings.Development.json")
            .Build();
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.ConfigureCors();
            services.ConfigureIISIntegration();
            services.ConfigureMySqlContext(Configuration);
            services.ConfigureAutoMapper();
            services.ConfigureSwagger();
            services.AddControllers(config =>
            {
                var policy = new AuthorizationPolicyBuilder()
                                 .RequireAuthenticatedUser()
                                 .Build();
                config.Filters.Add(new AuthorizeFilter(policy));
            });
            services.AddScoped<IGWContext, GWContext>();
            services.AddMediatR(typeof(GetAllUsersQuery).GetTypeInfo().Assembly);
            services.AddLogging(loggingBuilder => loggingBuilder.AddSerilog(dispose: true));


            services.AddIdentity<User, Role>()
                .AddRoles<Role>()
                .AddEntityFrameworkStores<GWContext>();
            //services.AddDefaultIdentity<User>()
            //        .AddRoles<Role>()
            //        .AddEntityFrameworkStores<GWContext>();

            services.ConfigureIdentityOptions();
            services.ConfigureJWT(Configuration);
            services.Configure<AppSettings>(Configuration.GetSection("AppSettings"));


            //services.AddMvc(options => options.EnableEndpointRouting = false)
            //     .AddFluentValidation(fv =>
            //     {
            //         fv.RegisterValidatorsFromAssemblyContaining<CreateUserCommandValidator>();
            //         fv.RunDefaultMvcValidationAfterFluentValidationExecutes = false;
            //     });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            // app.UseCors("CorsPolicy");

            app.UseCors(x => x
            .WithOrigins(Configuration["AppSettings:ClientUrl"].ToString())
                .AllowAnyHeader()
                .AllowAnyMethod());
            app.UseForwardedHeaders(new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.All
            });
            app.UseStaticFiles();
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Gamewaver");
            });
            // app.UseMvc();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
