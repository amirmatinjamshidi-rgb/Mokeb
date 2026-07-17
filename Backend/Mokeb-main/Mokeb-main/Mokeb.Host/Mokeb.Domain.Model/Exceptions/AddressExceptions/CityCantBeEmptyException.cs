using Mokeb.Common.Base.DomainExceptions;

namespace Mokeb.Domain.Model.Exceptions.AddressExceptions
{
    public class CityCantBeEmptyException : ValidationFailedDomainException
    {
        public CityCantBeEmptyException() : base("City Name can't be null or empty") { }
    }
}