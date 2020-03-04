using AutoMapper;
using GW.Application.Interfaces;
using GW.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace GW.Application.Roles.Commands.DeleteRole
{
    public class DeleteRoleCommandHandler : IRequestHandler<DeleteRoleCommand>
    {
        private readonly IMapper Mapper;
        private readonly IGWContext Context;
        private readonly UserManager<User> UserManager;
        private readonly RoleManager<Role> RoleManager;

        public DeleteRoleCommandHandler(
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

        public async Task<Unit> Handle(DeleteRoleCommand request, CancellationToken cancellationToken)
        {
            var role = await RoleManager.FindByIdAsync(request.Id);
            await RoleManager.DeleteAsync(role);
            return Unit.Value;
        }

    }
}
