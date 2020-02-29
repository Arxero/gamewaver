using GW.Application.Users.Models;
using GW.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace GW.Application.Users.Commands
{
    public class CreateUserCommand : IRequest<IdentityResult>
    {
        public RegisterUserDto UserModel { get; set; }

    }
}
