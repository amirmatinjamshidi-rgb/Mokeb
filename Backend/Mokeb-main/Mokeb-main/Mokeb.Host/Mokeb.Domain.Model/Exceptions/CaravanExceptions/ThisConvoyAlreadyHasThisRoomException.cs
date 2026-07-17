using Mokeb.Common.Base.DomainExceptions;

namespace Mokeb.Domain.Model.Exceptions.CaravanExceptions
{
    public class ThisConvoyAlreadyHasThisRoomException : ObjectAlreadyExistDomainException
    {
        public ThisConvoyAlreadyHasThisRoomException() : base("This Convoy Has This Room !") { }
    }
}