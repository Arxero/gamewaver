using GW.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace GW.Application.Interfaces
{
    public interface IGWContext
    {
        DbSet<User> ApplicationUsers { get; set; }
        DbSet<Role> ApplicationRoles { get; set; }
        DbSet<Post> Posts { get; set; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }
}
