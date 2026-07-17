using Mokeb.Common.Base.ApplicationExceptions;

namespace Mokeb.Domain.Model.Exceptions.RequestExceptions
{
    public class RequestRoomNotFoundException : ObjectNotFoundApplicationException
    {
        public RequestRoomNotFoundException() : base("RequestRoom not found") { }
    }
}