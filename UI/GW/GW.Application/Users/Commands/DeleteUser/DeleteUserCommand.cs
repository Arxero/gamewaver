using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace GW.Application.Users.Commands.DeleteUser
{
    public class DeleteUserCommand : IRequest
    {
        public string Id { get; set; }
    }
}
