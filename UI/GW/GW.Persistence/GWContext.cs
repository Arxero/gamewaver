using GW.Application.Interfaces;
using GW.Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace GW.Persistence
{
    public class GWContext : IdentityDbContext<User>, IGWContext
    {
        public GWContext(DbContextOptions<GWContext> options) : base(options)
        {
        }

        public DbSet<User> ApplicationUsers { get; set; }
        public DbSet<Role> ApplicationRoles { get; set; }
        public DbSet<Post> Posts { get; set; }

        //protected override void OnModelCreating(ModelBuilder modelBuilder)
        //{
        //    modelBuilder.Entity<User>().HasData(
        //     new User
        //     {
        //         Id = 1,
        //         Username = "Maverick",
        //         Email = "feruchio599@gmail.com",
        //         CreatedAt = new DateTime(2019, 07, 25),
        //         UpdatedAt = new DateTime(2019, 07, 25),
        //     },
        //    new User
        //    {
        //        Id = 2,
        //        Username = "Saad",
        //        Email = "saad@gmail.com",
        //        CreatedAt = new DateTime(2019, 07, 25),
        //        UpdatedAt = new DateTime(2019, 07, 25),
        //    },
        //    new User
        //    {
        //        Id = 3,
        //        Username = "Xinored",
        //        Email = "xinoredm@gmail.com",
        //        CreatedAt = new DateTime(2019, 07, 25),
        //        UpdatedAt = new DateTime(2019, 07, 25),
        //    },
        //    new User
        //    {
        //        Id = 4,
        //        Username = "Badboy",
        //        Email = "badboy@gmail.com",
        //        CreatedAt = new DateTime(2019, 07, 25),
        //        UpdatedAt = new DateTime(2019, 07, 25),
        //    },
        //    new User
        //    {
        //        Id = 5,
        //        Username = "Mr.Roller",
        //        Email = "roller@gmail.com",
        //        CreatedAt = new DateTime(2019, 07, 25),
        //        UpdatedAt = new DateTime(2019, 07, 25),
        //    });
        //}
    }
}
