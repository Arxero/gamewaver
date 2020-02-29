using System;
using System.Collections.Generic;
using System.Text;

namespace GW.Application.Users.Models
{
    public class RegisterUserDto
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
