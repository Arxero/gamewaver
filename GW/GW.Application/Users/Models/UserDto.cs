using GW.Domain.Infrastructure;
using System;
using System.Collections.Generic;
using System.Text;

namespace GW.Application.Users.Models
{
    public class UserDto: PublicEntity
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public int Age { get; set; }
        public string Location { get; set; }
        public string Gender { get; set; }
        public string Summary { get; set; }
        public string Website { get; set; }
        public string Avatar { get; set; }
    }
}
