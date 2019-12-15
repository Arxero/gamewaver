using GW.Domain.Infrastructure;
using System;
using System.Collections.Generic;
using System.Text;

namespace GW.Domain.Entities
{
    public class User : Entity<int>
    {
        public string Password { get; set; }

        public string Username { get; set; }

        public string Email { get; set; }
    }
}
