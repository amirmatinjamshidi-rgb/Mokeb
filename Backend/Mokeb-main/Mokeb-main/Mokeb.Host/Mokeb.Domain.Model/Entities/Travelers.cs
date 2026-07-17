using Mokeb.Domain.Model.Base;
using Mokeb.Domain.Model.Enums;
using Mokeb.Domain.Model.Exceptions.CaravanExceptions;
using System.Text.RegularExpressions;

namespace Mokeb.Domain.Model.Entities
{
    public class Travelers : BaseEntity<Guid>, IEquatable<Travelers>
    {
        public Travelers(string name, string familyName, string nationalCode, DateOnly dateOfBirth, string phoneNumber, Gender gender, string passportNumber, string emergencyPhoneNumber)
        {
            CheckName(name);
            CheckFamilyName(familyName);
            CheckNationalCode(nationalCode);
            CheckPassportNumber(passportNumber);
            CheckPhoneNumber(phoneNumber);

            Id = Guid.NewGuid();
            Name = name;
            FamilyName = familyName;
            NationalCode = nationalCode;
            DateOfBirth = dateOfBirth;
            PhoneNumber = phoneNumber;
            Gender = gender;
            PassportNumber = passportNumber;
            EmergencyPhoneNumber = emergencyPhoneNumber;
        }

        private Travelers() { } // For ef
        public string Name { get; private set; }
        public string FamilyName { get; private set; }
        public string NationalCode { get; private set; }
        public string PassportNumber { get; private set; }
        public DateOnly DateOfBirth { get; private set; }
        public string PhoneNumber { get; private set; }
        public string EmergencyPhoneNumber { get; private set; }
        public Gender Gender { get; private set; }




        #region Validations
        public void CheckPhoneNumber(string phoneNumber)
        {
            var pattern = @"^09\d{9}$";
            if (string.IsNullOrWhiteSpace(phoneNumber) || !Regex.IsMatch(phoneNumber, pattern))
                throw new PhoneNumberIsInvalidException();
        }
        public void CheckName(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new NameIsInvalidException();
        }
        public void CheckFamilyName(string familyName)
        {
            if (string.IsNullOrWhiteSpace(familyName))
                throw new FamilyNameIsInvalidException();
        }
        public void CheckNationalCode(string nationalCode)
        {
            var pattern = @"^\d{10}$";
            if (string.IsNullOrWhiteSpace(nationalCode) || !Regex.IsMatch(nationalCode, pattern))
                throw new NationalNumberIsInvalidException();
        }
        public void CheckPassportNumber(string passportNumber)
        {
            if (string.IsNullOrWhiteSpace(passportNumber))
                throw new PassportNumberIsInvalidException();
        }
        #endregion
        #region Equations
        public override bool Equals(object? obj)
        {
            return Equals(obj as Travelers);
        }
        public bool Equals(Travelers? other)
        {
            if (other is null) return false;
            if (ReferenceEquals(this, other)) return true;
            if (this.GetType() != other.GetType()) return false;
            return (this.NationalCode == other.NationalCode);
        }

        public override int GetHashCode()
        {
            return (NationalCode != null ? NationalCode.GetHashCode() : 0);
        }
        #endregion
    }
}
