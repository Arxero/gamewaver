using System;
using System.Collections.Generic;
using System.Text;

namespace GW.Application.Users.Models
{
    public class UserDto
    {
        public int Id { get; set; }
        public string Username { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Email { get; set; }

        public string Gender { get; set; }
    }
}
