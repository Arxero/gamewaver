using AutoMapper;
using GW.Application.Interfaces;
using GW.Application.Users.Models;
using GW.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace GW.Application.Roles.Commands.AddOrRemoveUsers
{
    public class AddOrRemoveUsersCommandHandler : IRequestHandler<AddOrRemoveUsersCommand>
    {
        private readonly IMapper Mapper;
        private readonly IGWContext Context;
        private UserManager<User> UserManager;
        private RoleManager<Role> RoleManager;

        public AddOrRemoveUsersCommandHandler(
            IGWContext context,
            IMapper mapper,
            UserManager<User> userManager,
            RoleManager<Role> roleManager
            )
        {
            Context = context;
            Mapper = mapper;
            UserManager = userManager;
            RoleManager = roleManager;
        }

        public async Task<Unit> Handle(AddOrRemoveUsersCommand request, CancellationToken cancellationToken)
        {

            //var role = new Role
            //{
            //    Name = request.Name,
            //    CreatedAt = DateTime.UtcNow,
            //    UpdatedAt = DateTime.UtcNow,
            //};

            // var result = await RoleManager.CreateAsync(role);
            return Unit.Value;
        }

    }
}
