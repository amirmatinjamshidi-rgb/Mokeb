using Mokeb.Common.Base.DomainExceptions;

namespace Mokeb.Domain.Model.Exceptions.RequestExceptions
{
    public class TravelersNotExistsException : ObjectNotFoundDomainException
    {
        public TravelersNotExistsException() : base("Traveler Not Found")
        {
        }
    }
}