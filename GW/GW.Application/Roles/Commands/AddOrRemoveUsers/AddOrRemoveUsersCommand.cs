using GW.Application.Users.Models;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace GW.Application.Roles.Commands.AddOrRemoveUsers
{
    public class AddOrRemoveUsersCommand : IRequest
    {
        public string UserId { get; set; }
        public string RoleId { get; set; }
        public string Username { get; set; }
        public bool IsSelected { get; set; }

    }
}
