using GW.Application.Users.Models;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace GW.Application.Roles.Commands.AddOrRemoveUsers
{
    public class AddOrRemoveUsersCommand : IRequest
    {
        public string RoleId { get; set; }
        public List<string> Users { get; set; }
    }
}
