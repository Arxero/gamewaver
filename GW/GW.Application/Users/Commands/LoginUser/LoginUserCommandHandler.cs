using AutoMapper;
using GW.Application.Interfaces;
using GW.Domain.Entities;
using GW.Models;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace GW.Application.Users.Commands.LoginUser
{
    public class LoginUserCommandHandler : IRequestHandler<LoginUserCommand, Object>
    {
        private readonly IMapper Mapper;
        private readonly IGWContext Context;
        private UserManager<User> UserManager;
        private readonly AppSettings AppSettings;

        public LoginUserCommandHandler(
            IGWContext context, 
            IMapper mapper,
            UserManager<User> userManager,
            IOptions<AppSettings> appSettings)
        {
            Context = context;
            Mapper = mapper;
            UserManager = userManager;
            AppSettings = appSettings.Value;
        }

        public async Task<Object> Handle(LoginUserCommand request, CancellationToken cancellationToken)
        {

            var user = await UserManager.FindByNameAsync(request.Username);
            var key = Encoding.UTF8.GetBytes(AppSettings.SecretKey);

            if (user != null && await UserManager.CheckPasswordAsync(user, request.Password))
            {
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new Claim[]
                    {
                        new Claim("UserID", user.Id.ToString())
                    }),
                    Expires = DateTime.UtcNow.AddMinutes(5),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                };

                var tokenHandler = new JwtSecurityTokenHandler();
                var securityToken = tokenHandler.CreateToken(tokenDescriptor);
                var token = tokenHandler.WriteToken(securityToken);
                return new { token };
            }
            else
            {
                return new { message = "Username or password is incorrect." };
            }
            //var user = new User
            //{
            //    UserName = request.UserModel.Username,
            //    Email = request.UserModel.Email,
            //};

            //var result = await UserManager.CreateAsync(user, request.UserModel.Password);
            //return result;


            //if (request.UserModel == null)
            //{
            //    throw new ArgumentNullException(nameof(request.UserModel));
            //}

            //var incomingUser = Mapper.Map<User>(request.UserModel);
            //incomingUser.CreatedAt = DateTime.Now;
            //incomingUser.UpdatedAt = DateTime.Now;

            //var theUser = await Context.ApplicationUsers.AddAsync(incomingUser);
            //await Context.SaveChangesAsync(cancellationToken);

            //var userToReturn = Mapper.Map<UserDto>(theUser.Entity);
            //return userToReturn;
        }

    }
}
