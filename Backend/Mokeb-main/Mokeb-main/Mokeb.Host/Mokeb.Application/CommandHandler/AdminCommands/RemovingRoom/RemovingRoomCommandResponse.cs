namespace Mokeb.Application.CommandHandler.AdminCommands.RemovingRoom
{
    public class RemovingRoomCommandResponse
    {
        public static RemovingRoomCommandResponse Succeeded => new() { Success = true };
        public bool Success { get; set; }
    }
}
