namespace Mokeb.Application.CommandHandler.AdminCommands.AddingRoom
{
    public class AddingRoomCommandResponse
    {
        public static AddingRoomCommandResponse Succeeded = new() { Success = true };

        public static AddingRoomCommandResponse SucceededWithId(Guid roomId) => new()
        {
            Success = true,
            RoomId = roomId,
            Id = roomId,
        };

        public bool Success { get; set; }
        public Guid RoomId { get; set; }
        public Guid Id { get; set; }
    }
}
