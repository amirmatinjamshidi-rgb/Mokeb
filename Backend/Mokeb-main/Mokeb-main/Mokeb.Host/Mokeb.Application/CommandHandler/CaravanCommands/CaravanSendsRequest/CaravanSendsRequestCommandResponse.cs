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
        public bool Result { get; set; }
    }
}
