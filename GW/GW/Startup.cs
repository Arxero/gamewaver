using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using FluentValidation.AspNetCore;
using GW.Application.Users.Commands.CreateUser;
using GW.Application.Users.Queries;
using GW.Extensions;
using GW.Persistence;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace GW
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
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
            services.AddScoped<IGamewaverContext, GamewaverContext>();

            // Add MediatR
            services.AddMediatR(typeof(GetAllUsersQuery).GetTypeInfo().Assembly);

            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2)
                 .AddFluentValidation(fv =>
                 {
                     fv.RegisterValidatorsFromAssemblyContaining<CreateUserCommandValidator>();
                     //fv.RunDefaultMvcValidationAfterFluentValidationExecutes = false;
                 });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseCors("CorsPolicy");
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

            app.UseHttpsRedirection();
            app.UseMvc();
        }
    }
}
