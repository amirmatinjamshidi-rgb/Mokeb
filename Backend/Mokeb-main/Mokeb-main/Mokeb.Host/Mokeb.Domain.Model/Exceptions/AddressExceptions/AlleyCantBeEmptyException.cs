using Mokeb.Common.Base.DomainExceptions;

namespace Mokeb.Domain.Model.Exceptions.AddressExceptions
{
    public class AlleyCantBeEmptyException : ValidationFailedDomainException
    {
        public AlleyCantBeEmptyException() : base("Alley Cant be null or empty") { }
    }
}