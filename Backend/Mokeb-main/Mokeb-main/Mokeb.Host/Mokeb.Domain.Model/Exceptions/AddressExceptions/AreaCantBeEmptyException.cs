using Mokeb.Common.Base.DomainExceptions;

namespace Mokeb.Domain.Model.Exceptions.AddressExceptions
{
    public class AreaCantBeEmptyException : ValidationFailedDomainException
    {
        public AreaCantBeEmptyException() : base("Area Name can't be null or empty") { }
    }
}