using GW.Domain.Infrastructure;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace GW.Domain.Entities
{
    public class User : IdentityUser
    {
        public User()
        {
            // Roles = new HashSet<Role>();
        }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int Age { get; set; }
        public string Location { get; set; }
        public string Gender { get; set; }
        public string Summary { get; set; }
        public string Website { get; set; }
        public string Avatar { get; set; }

       // public virtual ICollection<Role> Roles { get; set; }
    }
}
