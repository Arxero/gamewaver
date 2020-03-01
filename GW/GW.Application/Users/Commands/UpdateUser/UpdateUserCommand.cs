using GW.Application.Users.Models;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace GW.Application.Users.Commands.UpdateUser
{
    public class UpdateUserCommand : IRequest<UserDto>
    {
        public UserDto Model { get; set; }
        public string Id { get; set; }

    }
}
