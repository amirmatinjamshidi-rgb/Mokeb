namespace Mokeb.Application.Dtos
{
    public class CompanionDto
    {
        public CompanionDto(string name, string familyName, string phoneNumber, string nationalCode)
        {
            Name = name;
            FamilyName = familyName;
            PhoneNumber = phoneNumber;
            NationalCode = nationalCode;
        }

        public string Name { get; protected set; }
        public string FamilyName { get; protected set; }
        public string FullName => Name + " " + FamilyName;
        public string PhoneNumber { get; protected set; }
        public string NationalCode { get; protected set; }
    }
}
