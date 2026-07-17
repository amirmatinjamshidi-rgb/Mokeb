namespace Mokeb.Application.CommandHandler.AdminCommands.IncreasingRequestsNumberOfPeople
{
    public class AddingRoomAvailabilityToAnAcceptedRequestCommandResponse
    {
        public static AddingRoomAvailabilityToAnAcceptedRequestCommandResponse Succeeded => new() { Success = true };
        public bool Success { get; set; }
    }
}
