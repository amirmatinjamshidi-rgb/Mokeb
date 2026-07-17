namespace Mokeb.Application.CommandHandler.AdminCommands.RejectingARequestedRequest
{
    public class RejectingARequestedRequestCommandResponse
    {
        public static RejectingARequestedRequestCommandResponse Response()
        {
            return new RejectingARequestedRequestCommandResponse();
        }
        public RejectingARequestedRequestCommandResponse WithResult(bool result)
        {
            Result = result;
            return this;
        }
        public bool Result { get; set; }
    }
}
