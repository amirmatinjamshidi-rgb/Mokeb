using Mokeb.Common.Base.DomainExceptions;

namespace Mokeb.Domain.Model.Exceptions.RequestExceptions
{
    public class TravelersExistsException : ObjectAlreadyExistDomainException
    {
        public TravelersExistsException() : base("Travelers Exist") { }
    }
}