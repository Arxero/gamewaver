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

namespace GW.Application.Roles
{
    public class UpdateRoleCommandHandler : IRequestHandler<UpdateRoleCommand, RoleDto>
    {
        private readonly IMapper Mapper;
        private readonly IGWContext Context;
        private readonly UserManager<User> UserManager;
        private readonly RoleManager<Role> RoleManager;

        public UpdateRoleCommandHandler(
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

        public async Task<RoleDto> Handle(UpdateRoleCommand request, CancellationToken cancellationToken)
        {
            var role = await RoleManager.FindByIdAsync(request.Id);
            role.UpdatedAt = DateTime.Now;
            role.Name = request.Name;

            var result = await RoleManager.UpdateAsync(role);
            return Mapper.Map<RoleDto>(role);
        }

    }
}
