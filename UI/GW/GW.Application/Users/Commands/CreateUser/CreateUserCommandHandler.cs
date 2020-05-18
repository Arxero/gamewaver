using AutoMapper;
using GW.Application.Users.Commands.CreateUser;
using GW.Application.Users.Models;
using GW.Domain.Entities;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using GW.Application.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace GW.Application.Users.Commands
{
    public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, IdentityResult>
    {
        private readonly IMapper Mapper;
        private readonly IGWContext Context;
        private UserManager<User> UserManager;
        private SignInManager<User> SignManager;

        public CreateUserCommandHandler(
            IGWContext context,
            IMapper mapper,
            UserManager<User> userManager,
            SignInManager<User> signManager)
        {
            Context = context;
            Mapper = mapper;
            UserManager = userManager;
            SignManager = signManager;
        }


        public async Task<IdentityResult> Handle(CreateUserCommand request, CancellationToken cancellationToken)
        {
            var user = new User
            {
                UserName = request.Username,
                Email = request.Email,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var result = await UserManager.CreateAsync(user, request.Password);

            if (result.Succeeded)
            {
                await SignManager.SignInAsync(user, isPersistent: false);
            }

            return result;
        }

    }
}
