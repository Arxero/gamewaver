using System.Threading;
using System.Threading.Tasks;
using GW.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GW.Persistence
{
    public interface IGamewaverContext
    {
        DbSet<User> Users { get; set; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }
}