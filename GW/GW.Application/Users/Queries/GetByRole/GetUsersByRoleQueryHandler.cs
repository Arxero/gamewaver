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

namespace GW.Application.Users.Queries
{


    public class GetUsersByRoleQueryHandler : IRequestHandler<GetUsersByRoleQuery, PagedResult<UserDto>>
    {
        private readonly IMapper Mapper;
        private readonly IGWContext Context;
        public RoleManager<Role> RoleManager;
        private UserManager<User> UserManager;

        public GetUsersByRoleQueryHandler(
            IGWContext context,
            IMapper mapper,
            RoleManager<Role> roleManager,
            UserManager<User> userManager)
        {
            Context = context;
            Mapper = mapper;
            RoleManager = roleManager;
            UserManager = userManager;
        }

        public async Task<PagedResult<UserDto>> Handle(GetUsersByRoleQuery request, CancellationToken cancellationToken)
        {
            if (request.Paging == null || !request.Paging.IsValid())
            {
                request.Paging = Defaults.Paging;
            }

            var role = await RoleManager.FindByIdAsync(request.RoleId);
            var users = await UserManager.GetUsersInRoleAsync(role.Name);
            users.Skip(request.Paging.Skip).Take(request.Paging.Take);

            var total = users.Count;

            return new PagedResult<UserDto>
            {
                Items = users.Select(x => Mapper.Map<UserDto>(x)).ToList(),
                Total = total,
            };
        }
    }
}
