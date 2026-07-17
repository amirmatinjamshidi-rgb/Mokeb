namespace Mokeb.Application.CommandHandler.AdminCommands.AcceptingARequestedRequest
{
    public class AcceptingARequestedRequestCommandResponse
    {
        public static AcceptingARequestedRequestCommandResponse Succeded() => new();
        public AcceptingARequestedRequestCommandResponse WithResult(bool result)
        {
            Success = result;
            return this;
        }
        public bool Success { get; set; }
    }
}
