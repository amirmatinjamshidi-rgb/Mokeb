namespace Mokeb.Application.CommandHandler.AdminCommands.AddingRoomAvailability
{
    public class AddingRoomAvailabilityCommandResponse
    {
        public static AddingRoomAvailabilityCommandResponse Succeeded => new() { Success = true };
        public bool Success { get; set; }
    }
}
