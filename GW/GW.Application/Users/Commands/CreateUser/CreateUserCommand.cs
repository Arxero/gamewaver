using GW.Application.Users.Models;
using GW.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace GW.Application.Users.Commands
{
    public class CreateUserCommand : IRequest<UserDto>
    {
        public UserDto Model { get; set; }

    }
}
