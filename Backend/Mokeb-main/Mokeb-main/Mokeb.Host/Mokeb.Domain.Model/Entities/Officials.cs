using Mokeb.Domain.Model.Base;
using Mokeb.Domain.Model.Exceptions.CaravanExceptions;
using System.Text.RegularExpressions;

namespace Mokeb.Domain.Model.Entities
{
    public class Officials : BaseEntity<Guid>
    {
        private Officials() { } // for ef
        public Officials(string name, string lastName, string phoneNumber)
        {
            CheckName(name);
            CheckFamilyName(lastName);
            CheckPhoneNumber(phoneNumber);

            Id = Guid.NewGuid();
            Name = name;
            LastName = lastName;
            PhoneNumber = phoneNumber;
        }

        public string Name { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }

        #region Behaviors
        public void ChangeName(string name)
        {
            CheckName(name);
            Name = name;
        }
        public void ChangeFamilyName(string familyName)
        {
            CheckFamilyName(familyName);
            LastName = familyName;
        }
        public void ChangePhoneNumber(string phoneNumber)
        {
            CheckPhoneNumber(phoneNumber);
            PhoneNumber = phoneNumber;
        }
        #endregion
        #region Validations
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
        public void CheckPhoneNumber(string phoneNumber)
        {
            var pattern = @"^09\d{9}$";
            if (string.IsNullOrWhiteSpace(phoneNumber) || !Regex.IsMatch(phoneNumber, pattern))
                throw new PhoneNumberIsInvalidException();
        }
        #endregion
    }
}
