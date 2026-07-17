using Microsoft.EntityFrameworkCore;
using Mokeb.Domain.Model.Entities;
using Mokeb.Infrastructure.Configuration;

namespace Mokeb.Infrastructure.Context
{
    public class MokebDbContext : DbContext
    {
        public MokebDbContext(DbContextOptions<MokebDbContext> options) : base(options)
        {

        }
        public DbSet<CaravanPrincipal> CaravanPrincipals { get; set; }
        public DbSet<Pilgrim> Pilgrims { get; set; }
        public DbSet<IndividualPrincipal> IndividualPrincipals { get; set; }
        public DbSet<Companion> Companions { get; set; }
        public DbSet<Request> Requests { get; set; }
        public DbSet<Travelers> Travelers { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<FAQ> FAQs { get; set; }
        public DbSet<Gallery> Galleries { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(CaravanPrincipalConfiguration).Assembly);
        }

    }
}
