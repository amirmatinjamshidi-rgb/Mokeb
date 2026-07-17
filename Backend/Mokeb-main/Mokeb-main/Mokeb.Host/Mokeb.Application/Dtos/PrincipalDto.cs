using Mokeb.Domain.Model.Enums;

namespace Mokeb.Application.Dtos
{
    public class PrincipalDto
    {
        public PrincipalDto(string name, string familyName, string nationalCode, string passportNumber, DateOnly dateOfBirth, Gender gender, string gmail, string phoneNumber, string emergencyPhoneNumber, Guid principalId)
        {
            Name = name;
            FamilyName = familyName;
            NationalCode = nationalCode;
            PassportNumber = passportNumber;
            DateOfBirth = dateOfBirth;
            Gender = gender.ToString();
            Gmail = gmail;
            PhoneNumber = phoneNumber;
            EmergencyPhoneNumber = emergencyPhoneNumber;
            PrincipalId = principalId;
        }
        public Guid PrincipalId { get; set; }
        public string Name { get; protected set; }
        public string FamilyName { get; protected set; }
        public string NationalCode { get; protected set; }
        public string PassportNumber { get; protected set; }
        public DateOnly DateOfBirth { get; protected set; }
        public string Gender { get; protected set; }
        public string Gmail { get; protected set; }
        public string PhoneNumber { get; protected set; }
        public string EmergencyPhoneNumber { get; protected set; }
    }
}
