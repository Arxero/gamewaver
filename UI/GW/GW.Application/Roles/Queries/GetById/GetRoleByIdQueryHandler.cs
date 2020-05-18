using AutoMapper;
using GW.Application.Interfaces;
using GW.Application.Users.Models;
using GW.Domain.Entities;
using GW.Domain.Infrastructure;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;


namespace GW.Application.Roles.Queries
{
    public class GetRoleByIdQueryHandler : IRequestHandler<GetRoleByIdQuery, RoleDto>
    {
        private readonly IMapper Mapper;
        private readonly IGWContext Context;
        public RoleManager<Role> RoleManager;

        public GetRoleByIdQueryHandler(
            IGWContext context,
            IMapper mapper,
            RoleManager<Role> roleManager)
        {
            Context = context;
            Mapper = mapper;
            RoleManager = roleManager;
        }

        public async Task<RoleDto> Handle(GetRoleByIdQuery request, CancellationToken cancellationToken)
        {
            var role = await RoleManager.FindByIdAsync(request.Id);
            return Mapper.Map<RoleDto>(role);
        }
    }
}
