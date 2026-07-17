using Mokeb.Common.Base.DomainExceptions;

namespace Mokeb.Domain.Model.Exceptions.RoomExceptions
{
    public class ThisUserIsInThisRoomException : ObjectAlreadyExistDomainException
    {
        public ThisUserIsInThisRoomException() : base("This User Is Already In This Room") { }
    }
}