using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace GW.Application.Roles.Commands.DeleteRole
{

    public class DeleteRoleCommand : IRequest
    {
        public string Id { get; set; }
    }
}
