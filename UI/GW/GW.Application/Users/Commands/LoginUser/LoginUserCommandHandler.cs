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
        private SignInManager<User> SignManager;
        private readonly AppSettings AppSettings;


        public LoginUserCommandHandler(
            IGWContext context, 
            IMapper mapper,
            UserManager<User> userManager,
            SignInManager<User> signManager,
            IOptions<AppSettings> appSettings
            )
        {
            Context = context;
            Mapper = mapper;
            UserManager = userManager;
            SignManager = signManager;
            AppSettings = appSettings.Value;
        }

        public async Task<Object> Handle(LoginUserCommand request, CancellationToken cancellationToken)
        {

            //if (result.Succeeded)
            //{
            //    return new { success = true };
            //}

            //return new { success = false };

            var user = await UserManager.FindByNameAsync(request.Username);
            var key = Encoding.UTF8.GetBytes(AppSettings.SecretKey);

            if (user != null && await UserManager.CheckPasswordAsync(user, request.Password))
            {
                var result = await SignManager.PasswordSignInAsync(request.Username, request.Password, request.RememberMe, false);
                var claims = new List<Claim>
                {
                    new Claim("UserID", user.Id.ToString()),
                };

                var roles = await UserManager.GetRolesAsync(user);
                AddRolesToClaims(claims, roles);

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(claims),
                    Expires = DateTime.UtcNow.AddHours(4),
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
        }

        private void AddRolesToClaims(List<Claim> claims, IEnumerable<string> roles)
        {
            foreach (var role in roles)
            {
                var roleClaim = new Claim(ClaimTypes.Role, role);
                claims.Add(roleClaim);
            }
        }

    }
}
