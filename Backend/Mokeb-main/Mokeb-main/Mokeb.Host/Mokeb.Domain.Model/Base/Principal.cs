using Mokeb.Domain.Model.Entities;
using Mokeb.Domain.Model.Enums;
using Mokeb.Domain.Model.Exceptions.CaravanExceptions;
using Mokeb.Domain.Model.Exceptions.IndividualExceptions;
using Mokeb.Domain.Model.ValueObjects;
using System.Text.RegularExpressions;

namespace Mokeb.Domain.Model.Base
{
    public abstract class Principal : BaseEntity<Guid>
    {
        private List<Request> _requests = new List<Request>();
        protected Principal() { }

        protected Principal(string name, string familyName, string nationalCode, string passportNumber
            , DateOnly dateOfBirth, Gender gender, ContactInformation contactInformation, IdentityInformation identityInformation)
        {
            CheckName(name);
            CheckFamilyName(familyName);
            CheckNationalCode(nationalCode);
            CheckPassportNumber(passportNumber);

            Id = Guid.NewGuid();
            Name = name;
            FamilyName = familyName;
            NationalCode = nationalCode;
            PassportNumber = passportNumber;
            DateOfBirth = dateOfBirth;
            Gender = gender;
            ContactInformation = contactInformation;
            IdentityInformation = identityInformation;
            IsActive = true;
        }

        public string Name { get; protected set; }
        public string FamilyName { get; protected set; }
        public string NationalCode { get; protected set; }
        public string PassportNumber { get; protected set; }
        public DateOnly DateOfBirth { get; protected set; }
        public Gender Gender { get; protected set; }
        public ContactInformation ContactInformation { get; protected set; }
        public IdentityInformation IdentityInformation { get; protected set; }
        public bool IsActive { get; protected set; }

        public IEnumerable<Request> Requests => _requests.AsReadOnly();


        #region Behaviors
        public void ChangeName(string name)
        {
            CheckName(name);
            Name = name;
        }
        public void ChangeFamilyName(string familyName)
        {
            CheckFamilyName(familyName);
            FamilyName = familyName;
        }
        public void ChangeNationalCode(string nationalCode)
        {
            CheckNationalCode(nationalCode);
            NationalCode = nationalCode;
        }
        public void ChangeDateOfBirth(DateOnly dateOfBirth)
        {
            DateOfBirth = dateOfBirth;
        }
        public void ChangeGender(Gender gender)
        {
            Gender = gender;
        }
        public void ChangePassportNumber(string passportNumber)
        {
            CheckPassportNumber(passportNumber);
            PassportNumber = passportNumber;
        }
        public void AddRequest(Request request)
        {
            _requests.Add(request);
        }
        public void RemoveRequest(Request request)
        {
            if (!_requests.Any(x => x == request))
                throw new RequestNotFoundException();
            _requests.Remove(request);
        }
        public void Active() => IsActive = true;
        public void Deactive() => IsActive = false;
        #endregion
        #region Validations
        public void CheckUsername(string username)
        {
            if (string.IsNullOrWhiteSpace(username))
                throw new UsernameIsInvalidException();
        }

        public void CheckPassword(string password)
        {
            if (string.IsNullOrWhiteSpace(password))
                throw new PasswordInvalidException();
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

    }
}
