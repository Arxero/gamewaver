using MediatR;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace GW.Application.Users.Commands.LoginUser
{
    public class LoginUserCommand : IRequest<Object>
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
