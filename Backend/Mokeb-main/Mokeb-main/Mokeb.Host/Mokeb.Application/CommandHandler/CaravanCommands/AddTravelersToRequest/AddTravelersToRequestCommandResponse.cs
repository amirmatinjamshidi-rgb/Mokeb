namespace Mokeb.Application.CommandHandler.CaravanCommands.AddTravelersToRequest
{
    public class AddTravelersToRequestCommandResponse
    {
        public static AddTravelersToRequestCommandResponse Response() => new();
        public AddTravelersToRequestCommandResponse WithResult(bool result)
        {
            Result = result;
            return this;
        }
        public bool Result { get; set; }
    }
}
