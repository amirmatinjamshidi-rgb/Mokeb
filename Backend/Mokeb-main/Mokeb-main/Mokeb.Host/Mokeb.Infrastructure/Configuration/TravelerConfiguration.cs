using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Mokeb.Domain.Model.Entities;

namespace Mokeb.Infrastructure.Configuration
{
    public class TravelersConfiguration : IEntityTypeConfiguration<Travelers>
    {
        public void Configure(EntityTypeBuilder<Travelers> builder)
        {
            builder.ToTable("Travelers");

            builder.Property(x => x.Id).ValueGeneratedNever();
            builder.Property(x => x.Name).IsRequired().HasMaxLength(100);
            builder.Property(x => x.FamilyName).IsRequired().HasMaxLength(100);
            builder.Property(x => x.NationalCode).IsRequired().HasMaxLength(10);
            builder.Property(x => x.PhoneNumber).HasMaxLength(11);
            builder.Property(x => x.Gender).HasConversion<string>().IsRequired();

        }
    }
}
