using Mokeb.Domain.Model.Base;
using Mokeb.Domain.Model.Enums;
using Mokeb.Domain.Model.Exceptions.CaravanExceptions;
using Mokeb.Domain.Model.ValueObjects;

namespace Mokeb.Domain.Model.Entities
{
    public class CaravanPrincipal : Principal, IEquatable<CaravanPrincipal>
    {
        protected internal List<Pilgrim> _pilgrims = new List<Pilgrim>();
        private CaravanPrincipal() { } // For ef
        public CaravanPrincipal(string name, string familyName, string nationalCode,
            DateOnly dateOfBirth, Gender gender, string passportNumber, ContactInformation contactInformation, IdentityInformation identityInformation) :
            base(name, familyName, nationalCode, passportNumber, dateOfBirth, gender, contactInformation, identityInformation)
        {
        }
        public IEnumerable<Pilgrim> Pilgrims => _pilgrims.AsReadOnly();

        #region Behaviors
        public void AddPilgrim(Pilgrim pilgrim)
        {
            if (_pilgrims.Contains(pilgrim))
                throw new ThisPilgrimAlreadyExistException();
            _pilgrims.Add(pilgrim);
        }
        public void RemovePilgrim(Pilgrim pilgrim)
        {
            if (!_pilgrims.Contains(pilgrim))
                throw new PilgrimNotFoundException();
            _pilgrims.Remove(pilgrim);
        }
        #endregion
        #region Equations
        public override bool Equals(object? obj)
        {
            return Equals(obj as CaravanPrincipal);
        }
        public bool Equals(CaravanPrincipal? other)
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
