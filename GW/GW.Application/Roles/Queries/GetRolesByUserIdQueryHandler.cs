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
    public class GetRolesByUserIdQueryHandler : IRequestHandler<GetRolesByUserIdQuery, PagedResult<RoleDto>>
    {
        private readonly IMapper Mapper;
        private readonly IGWContext Context;
        public RoleManager<Role> RoleManager;

        public GetRolesByUserIdQueryHandler(
            IGWContext context,
            IMapper mapper,
            RoleManager<Role> roleManager)
        {
            Context = context;
            Mapper = mapper;
            RoleManager = roleManager;
        }

        public async Task<PagedResult<RoleDto>> Handle(GetRolesByUserIdQuery request, CancellationToken cancellationToken)
        {
            if (request.Paging == null || !request.Paging.IsValid())
            {
                request.Paging = Defaults.Paging;
            }

            var roles = await RoleManager.Roles
                .Include(x => x.Users)
                .Where(x => x.Users.Any(x => x.Id == request.UserId))
                .Skip(request.Paging.Skip)
                .Take(request.Paging.Take)
                .ToListAsync(cancellationToken);
            var total = await Context.ApplicationRoles.CountAsync();

            return new PagedResult<RoleDto>
            {
                Items = roles.Select(x => Mapper.Map<RoleDto>(x)).ToList(),
                Total = total,
            };
        }
    }
}
