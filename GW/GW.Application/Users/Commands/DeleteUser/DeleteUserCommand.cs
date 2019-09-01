using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace GW.Application.Users.Commands.DeleteUser
{
    public class DeleteUserCommand : IRequest
    {
        public int Id { get; set; }
    }
}
