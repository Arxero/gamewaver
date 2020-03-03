using GW.Application.Users.Models;
using MediatR;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace GW.Application.Roles
{
    public class CreateRoleCommand : IRequest<RoleDto> 
    {
        [Required]
        public string Name { get; set; }
    }
}
