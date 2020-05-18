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

namespace GW.Application.Users.Commands.LogoutUser
{
    public class LogoutUserCommandHandler : IRequestHandler<LogoutUserCommand, Object>
    {
        private readonly IMapper Mapper;
        private readonly IGWContext Context;
        private UserManager<User> UserManager;
        private readonly AppSettings AppSettings;
        private readonly SignInManager<User> SignInManager;

        public LogoutUserCommandHandler(
            IGWContext context,
            IMapper mapper,
            UserManager<User> userManager,
            IOptions<AppSettings> appSettings,
            SignInManager<User> signInManager)
        {
            Context = context;
            Mapper = mapper;
            UserManager = userManager;
            AppSettings = appSettings.Value;
            SignInManager = signInManager;
        }

        public async Task<Object> Handle(LogoutUserCommand request, CancellationToken cancellationToken)
        {
            await SignInManager.SignOutAsync();
            return new { message = "User logged out." };
        }

    }
}
