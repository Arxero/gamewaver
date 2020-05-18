using AutoMapper;
using GW.Application.Interfaces;
using GW.Application.Users.Models;
using GW.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
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
            var role = await RoleManager.FindByIdAsync(request.RoleId);
            //var users = await Context.ApplicationUsers
            //    .AsNoTracking()
            //    .Where(x => request.Users.Contains(x.Id))
            //    .ToListAsync(cancellationToken);


            foreach (var userId in request.Users)
            {
                var user = await UserManager.FindByIdAsync(userId);
                if (await UserManager.IsInRoleAsync(user, role.Name))
                {
                    await UserManager.RemoveFromRoleAsync(user, role.Name);
                }
                else
                {
                    await UserManager.AddToRoleAsync(user, role.Name);
                }
            }
            return Unit.Value;
        }

    }
}
