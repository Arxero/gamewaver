using GW.Domain.Infrastructure;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace GW.Domain.Entities
{
    public class Role : IdentityRole
    {
        public Role()
        {
            Users = new HashSet<User>();
        }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public virtual ICollection<User> Users { get; set; }
    }
}
