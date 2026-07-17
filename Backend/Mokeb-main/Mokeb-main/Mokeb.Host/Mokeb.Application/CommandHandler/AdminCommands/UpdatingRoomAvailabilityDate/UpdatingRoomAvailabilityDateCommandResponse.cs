namespace Mokeb.Application.CommandHandler.AdminCommands.RemovingRoomAvailability
{
    public class UpdatingRoomAvailabilityDateCommandResponse
    {
        public static UpdatingRoomAvailabilityDateCommandResponse Succeeded => new() { Success = true };
        public bool Success { get; set; }
    }
}
