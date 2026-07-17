using Mokeb.Common.Base.ApplicationExceptions;

namespace Mokeb.Application.Exceptions
{
    public class ThisRoomIsAvailableAtThisDateException : ObjectFoundApplicationException
    {
        public ThisRoomIsAvailableAtThisDateException() : base("This Room Is available at that day !") { }
    }
}