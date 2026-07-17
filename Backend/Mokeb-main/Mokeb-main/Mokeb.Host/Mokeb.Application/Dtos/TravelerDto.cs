using Mokeb.Domain.Model.Enums;

namespace Mokeb.Application.Dtos
{
    public class TravelerDto
    {
        public TravelerDto(string name, string lastName, Gender gender, string phoneNumber, string emergencyPhoneNumber, string nationalCode, string passportNumber, DateOnly dateOfBirth)
        {
            Name = name;
            LastName = lastName;
            Gender = gender;
            PhoneNumber = phoneNumber;
            EmergencyPhoneNumber = emergencyPhoneNumber;
            NationalCode = nationalCode;
            PassportNumber = passportNumber;
            DateOfBirth = dateOfBirth;
        }

        public string Name { get; set; }
        public string LastName { get; set; }
        public Gender Gender { get; set; }
        public string PhoneNumber { get; set; }
        public string EmergencyPhoneNumber { get; set; }
        public string NationalCode { get; set; }
        public string PassportNumber { get; set; }
        public DateOnly DateOfBirth { get; set; }
    }
}
