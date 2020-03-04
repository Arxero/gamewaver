using GW.Application.Users.Models;
using MediatR;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace GW.Application.Roles
{
    public class UpdateRoleCommand : IRequest<RoleDto> 
    {
        public string Id { get; set; }

        [Required(ErrorMessage ="Role name is required!")]
        public string Name { get; set; }
    }
}
