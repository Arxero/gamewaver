using GW.Domain.Entities;
using JetBrains.Annotations;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace GW.Persistence
{
    public class GamewaverContext : DbContext, IGamewaverContext
    {
        public GamewaverContext(DbContextOptions<GamewaverContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasData(
             new User
             {
                 Id = 1,
                 Username = "Maverick",
                 FirstName = "Maverick",
                 LastName = "Cloud",
                 Email = "feruchio599@gmail.com",
                 CreatedAt = new DateTime(2019, 07, 25),
                 UpdatedAt = new DateTime(2019, 07, 25),
                 Gender = "Male",
             },
            new User
            {
                Id = 2,
                Username = "Saad",
                FirstName = "Saad",
                LastName = "Salim",
                Email = "saad@gmail.com",
                CreatedAt = new DateTime(2019, 07, 25),
                UpdatedAt = new DateTime(2019, 07, 25),
                Gender = "Male",
            },
            new User
            {
                Id = 3,
                Username = "Xinored",
                FirstName = "Xinored",
                LastName = "Deronix",
                Email = "xinoredm@gmail.com",
                CreatedAt = new DateTime(2019, 07, 25),
                UpdatedAt = new DateTime(2019, 07, 25),
                Gender = "Male",
            },
            new User
            {
                Id = 4,
                Username = "Badboy",
                FirstName = "Badboy",
                LastName = "Boy",
                Email = "badboy@gmail.com",
                CreatedAt = new DateTime(2019, 07, 25),
                UpdatedAt = new DateTime(2019, 07, 25),
                Gender = "Male",
            },
            new User
            {
                Id = 5,
                Username = "Mr.Roller",
                FirstName = "Roller",
                LastName = "Rolls",
                Email = "roller@gmail.com",
                CreatedAt = new DateTime(2019, 07, 25),
                UpdatedAt = new DateTime(2019, 07, 25),
                Gender = "Male",
            });
        }
    }
}
