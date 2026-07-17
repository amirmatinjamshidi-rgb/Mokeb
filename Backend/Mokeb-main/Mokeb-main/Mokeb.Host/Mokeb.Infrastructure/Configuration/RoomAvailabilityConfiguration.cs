using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Mokeb.Domain.Model.Entities;

namespace Mokeb.Infrastructure.Configuration
{
    public class RoomAvailabilityConfiguration : IEntityTypeConfiguration<RoomAvailability>
    {
        public void Configure(EntityTypeBuilder<RoomAvailability> builder)
        {

            builder.Property(x => x.AvailableDay)
              .IsRequired();

            builder.Property(x => x.AvailableCapacity)
              .IsRequired();

            builder.Property(x => x.Id)
            .IsRequired()
            .ValueGeneratedNever();
        }
    }
}

