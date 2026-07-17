using Mokeb.Domain.Model.Base;
using Mokeb.Domain.Model.Enums;
using Mokeb.Domain.Model.Exceptions.CompanionExceptions;
using Mokeb.Domain.Model.ValueObjects;

namespace Mokeb.Domain.Model.Entities
{
    public class IndividualPrincipal : Principal, IEquatable<IndividualPrincipal>
    {
        private List<Companion> _companion = new List<Companion>();
        private IndividualPrincipal() { } // For ef
        public IndividualPrincipal(string name, string familyName, string nationalCode,
            DateOnly dateOfBirth, Gender gender, string passportNumber, ContactInformation contactInformation, IdentityInformation identityInformation) :
            base(name, familyName, nationalCode, passportNumber, dateOfBirth, gender, contactInformation, identityInformation)
        {
        }

        public IEnumerable<Companion> Companion => _companion.AsReadOnly();

        #region Behaviors
        public void AddCompanion(Companion companion)
        {
            if (_companion.Any(x => x == companion))
                throw new CompanionAlreadyExistsException();
            _companion.Add(companion);
        }
        public void RemoveCompanion(Companion companion)
        {
            if (!_companion.Any(x => x == companion))
                throw new CompanionNotFoundException();
            _companion.Remove(companion);
        }
        #endregion
        #region Equations
        public override bool Equals(object? obj)
        {
            return Equals(obj as IndividualPrincipal);
        }
        public bool Equals(IndividualPrincipal? other)
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
