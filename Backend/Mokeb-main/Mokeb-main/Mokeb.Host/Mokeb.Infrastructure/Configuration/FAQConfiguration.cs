using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Mokeb.Domain.Model.Entities;

namespace Mokeb.Infrastructure.Configuration
{
    public class FAQConfiguration : IEntityTypeConfiguration<FAQ>
    {
        public void Configure(EntityTypeBuilder<FAQ> builder)
        {
            builder.ToTable("FAQs");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Question)
                   .IsRequired()
                   .HasMaxLength(500);

            builder.Property(x => x.Answer)
                   .IsRequired()
                   .HasMaxLength(2000);
        }
    }
}
