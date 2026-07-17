using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Mokeb.Domain.Model.Entities;

namespace Mokeb.Infrastructure.Configuration
{
    public class RequestConfiguration : IEntityTypeConfiguration<Request>
    {
        public void Configure(EntityTypeBuilder<Request> builder)
        {
            builder.ToTable("Requests");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.MaleCount).IsRequired();
            builder.Property(x => x.FemaleCount).IsRequired();

            builder.Property(x => x.State)
                .HasConversion<int>()
                .IsRequired();

            builder.Property(x => x.DateOfAcceptingRequest)
                .IsRequired(false);

            builder.OwnsMany(x => x.Rooms);


            builder.HasMany(x => x.Travelers)
                .WithOne()
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
