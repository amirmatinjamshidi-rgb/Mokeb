namespace Mokeb.Application.CommandHandler.CaravanCommands.CaravanSendsRequest
{
    public class CaravanSendsRequestCommandResponse
    {
        public static CaravanSendsRequestCommandResponse Response() => new();
        public CaravanSendsRequestCommandResponse WithResult(bool result)
        {
            Result = result;
            return this;
        }
        public CaravanSendsRequestCommandResponse WithRequestId(Guid requestId)
        {
            RequestId = requestId;
            Result = true;
            return this;
        }
        public bool Result { get; set; }
        public Guid RequestId { get; set; }
        public Guid Id => RequestId;
    }
}
