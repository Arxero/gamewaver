using GW.Domain.Infrastructure;
using System;
using System.Collections.Generic;
using System.Text;

namespace GW.Domain.Entities
{
    public class Post : Entity<int>
    {
        public string Content { get; set; }
    }
}
