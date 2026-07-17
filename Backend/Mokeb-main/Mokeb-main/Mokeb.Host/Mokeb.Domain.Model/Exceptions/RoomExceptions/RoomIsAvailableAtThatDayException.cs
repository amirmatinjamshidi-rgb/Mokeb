
using Mokeb.Common.Base.DomainExceptions;

namespace Mokeb.Domain.Model.Exceptions.RoomExceptions
{
    public class RoomIsAvailableAtThatDayException : ObjectAlreadyExistDomainException
    {
        public RoomIsAvailableAtThatDayException() : base("room is available at that day") { }
    }
}