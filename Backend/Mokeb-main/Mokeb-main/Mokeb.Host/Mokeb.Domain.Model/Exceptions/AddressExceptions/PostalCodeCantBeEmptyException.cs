using Mokeb.Common.Base.DomainExceptions;

namespace Mokeb.Domain.Model.Exceptions.AddressExceptions
{
    public class PostalCodeCantBeEmptyException : ValidationFailedDomainException
    {
        public PostalCodeCantBeEmptyException() : base("Postal Code Can't Be Empty") { }
    }
}