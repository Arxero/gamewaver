using System;
using System.Collections.Generic;
using System.Text;

namespace GW.Domain.Infrastructure
{
    public abstract class Entity<T> where T : IEquatable<T>
    {
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public T Id { get; set; }
    }
}
