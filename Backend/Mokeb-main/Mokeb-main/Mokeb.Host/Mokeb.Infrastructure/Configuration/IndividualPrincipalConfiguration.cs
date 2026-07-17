using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Mokeb.Domain.Model.Entities;

namespace Mokeb.Infrastructure.Configuration
{
    public class IndividualPrincipalConfiguration : IEntityTypeConfiguration<IndividualPrincipal>
    {
        public void Configure(EntityTypeBuilder<IndividualPrincipal> builder)
        {
            builder.ToTable("IndividualPrincipals");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Name)
                .IsRequired()
                .HasMaxLength(100);
            builder.Property(x => x.FamilyName)
                .IsRequired()
                .HasMaxLength(100);
            builder.Property(x => x.NationalCode)
                .IsRequired()
                .HasMaxLength(10);
            builder.Property(x => x.PassportNumber)
                .HasMaxLength(50);
            builder.Property(x => x.DateOfBirth)
                .IsRequired();
            builder.Property(x => x.Gender)
                .HasConversion<string>()
                .IsRequired();

            builder.OwnsOne(x => x.ContactInformation, ci =>
            {
                ci.Property(p => p.Gmail)
                  .IsRequired()
                  .HasMaxLength(150);
                ci.Property(p => p.PhoneNumber)
                  .IsRequired()
                  .HasMaxLength(11);
                ci.Property(p => p.EmergencyPhoneNumber)
                  .HasMaxLength(11);
            });

            builder.OwnsOne(x => x.IdentityInformation, ii =>
            {
                ii.Property(p => p.Username)
                  .IsRequired()
                  .HasMaxLength(100);
                ii.Property(p => p.Password)
                  .IsRequired()
                  .HasMaxLength(200);
                ii.Property(p => p.Role)
                  .IsRequired();
                ii.Property(x => x.BloodType)
                .IsRequired()
                .HasConversion<string>();
            });

            builder.HasMany(x => x.Companion)
                   .WithOne()
                   .HasForeignKey(x => x.PrincipalId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
