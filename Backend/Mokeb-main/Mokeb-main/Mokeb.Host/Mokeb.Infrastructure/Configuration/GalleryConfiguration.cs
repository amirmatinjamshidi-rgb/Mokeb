using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Mokeb.Domain.Model.Entities;

namespace Mokeb.Infrastructure.Configuration
{
    public class GalleryConfiguration : IEntityTypeConfiguration<Gallery>
    {
        public void Configure(EntityTypeBuilder<Gallery> builder)
        {
            builder.ToTable("Galleries");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.FilePath)
                   .IsRequired()
                   .HasMaxLength(500);

            builder.Property(x => x.Title)
                   .IsRequired()
                   .HasMaxLength(200);

            builder.Property(x => x.Detail)
                   .IsRequired()
                   .HasMaxLength(2000);

            builder.Property(x => x.AdminUsername)
                .IsRequired();
        }
    }
}
