using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Mokeb.Common.Base.Helper;
using Mokeb.Domain.Model.Entities;

namespace Mokeb.Infrastructure.Configuration
{
    public class AdminConfiguration : IEntityTypeConfiguration<Admin>
    {
        public static readonly Guid DefaultAdminId =
            Guid.Parse("11111111-1111-1111-1111-111111111111");

        public void Configure(EntityTypeBuilder<Admin> builder)
        {
            builder.ToTable("Admins");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Id)
                .ValueGeneratedNever();

            builder.Property(x => x.Username)
                .IsRequired()
                .HasMaxLength(100);

            builder.HasIndex(x => x.Username)
                .IsUnique();

            builder.Property(x => x.Password)
                .IsRequired()
                .HasMaxLength(64);

            builder.Ignore(x => x.Role);

            builder.HasData(new
            {
                Id = DefaultAdminId,
                Username = "admin",
                Password = Hasher.HashData("admin"),
            });
        }
    }
}
