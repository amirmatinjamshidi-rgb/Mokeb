using Mokeb.Common.Base.ApplicationExceptions;

namespace Mokeb.Application.Exceptions
{
    public class ThisRoomAlreadyExistException : ObjectFoundApplicationException
    {
        public ThisRoomAlreadyExistException() : base("This Room Is Already added") { }
    }
}