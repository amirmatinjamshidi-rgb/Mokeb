using Mokeb.Common.Base.DomainExceptions;

namespace Mokeb.Domain.Model.Exceptions.RequestExceptions
{
    public class NotEnoughCapacityForNewUserException : NotAllowedDomainException
    {
        public NotEnoughCapacityForNewUserException() : base("Not Enough Capacity For This Action") { }
    }
}