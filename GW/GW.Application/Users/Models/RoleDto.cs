using GW.Domain.Infrastructure;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace GW.Application.Users.Models
{
    public class RoleDto : PublicEntity
    {
        [Required]
        public string Name { get; set; }
    }
}
