namespace Mokeb.Application.Dtos
{
    public class IndividualPrincipalDto
    {
        public IndividualPrincipalDto(Guid principalId, string name, string familyName, string phoneNumber,
            IEnumerable<CompanionDto> travelers, bool isActive)
        {
            PrincipalId = principalId;
            Name = name;
            FamilyName = familyName;
            PhoneNumber = phoneNumber;
            Companions = travelers;
            IsActive = isActive;
        }

        public Guid PrincipalId { get; set; }
        public string Name { get; protected set; }
        public string FamilyName { get; protected set; }
        public string FullName => Name + " " + FamilyName;
        public string PhoneNumber { get; protected set; }
        public bool IsActive { get; protected set; }
        public string IsActiveString => IsActive is true ? "Active" : "Deactive";
        public IEnumerable<CompanionDto> Companions { get; protected set; }
        public uint CompanionAmount => (uint)Companions.Count();
    }
}
