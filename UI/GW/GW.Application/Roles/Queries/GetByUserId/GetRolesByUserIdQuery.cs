using GW.Application.Users.Models;
using GW.Domain.Infrastructure;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace GW.Application.Roles.Queries
{
    public class GetRolesByUserIdQuery : IRequest<PagedResult<RoleDto>>
    {
        public Paging Paging { get; set; }
        public string UserId { get; set; }
    }
}
