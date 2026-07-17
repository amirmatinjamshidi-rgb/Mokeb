using Mokeb.Common.Base.DomainExceptions;

namespace Mokeb.Application.Exceptions
{
    public class RoomNotFoundException : ObjectNotFoundDomainException
    {
        public RoomNotFoundException() : base("Room Not Found") { }
    }
}