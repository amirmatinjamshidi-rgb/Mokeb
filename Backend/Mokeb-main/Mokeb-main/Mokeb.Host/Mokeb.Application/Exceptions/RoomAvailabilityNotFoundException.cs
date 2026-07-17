using Mokeb.Common.Base.ApplicationExceptions;

namespace Mokeb.Application.Exceptions
{
    public class RoomAvailabilityNotFoundException : ObjectNotFoundApplicationException
    {
        public RoomAvailabilityNotFoundException() : base("RoomAvailability Not found !") { }
    }
}