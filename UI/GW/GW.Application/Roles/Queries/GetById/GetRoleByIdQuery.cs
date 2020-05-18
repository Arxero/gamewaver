using GW.Application.Users.Models;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace GW.Application.Roles.Queries
{
    public class GetRoleByIdQuery : IRequest<RoleDto>
    {
        public string Id { get; set; }
    }
}
