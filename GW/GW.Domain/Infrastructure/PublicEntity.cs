using System;

namespace GW.Domain.Infrastructure
{
    public abstract class PublicEntity
    {
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string Id { get; set; }
    }
}
