using Mokeb.Domain.Model.Entities;

namespace Mokeb.Application.CommandHandler.AdminCommands.AddingRoomAvailability
{
    public static class RoomAvailabilityMapper
    {
        public static RoomAvailability ToRoomAvailability(this AddingRoomAvailabilityCommand command , uint capacity) => new RoomAvailability(command.DateOfAvailability , capacity);
    }
}
