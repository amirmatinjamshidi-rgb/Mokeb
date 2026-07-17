using Mokeb.Common.Base.ApplicationExceptions;

namespace Mokeb.Domain.Model.Exceptions.RequestExceptions
{
    public class RequestRoomAlreadyExistException : ObjectFoundApplicationException
    {
        public RequestRoomAlreadyExistException() : base("This Request Already Has this RequestRoom") { }
    }
}