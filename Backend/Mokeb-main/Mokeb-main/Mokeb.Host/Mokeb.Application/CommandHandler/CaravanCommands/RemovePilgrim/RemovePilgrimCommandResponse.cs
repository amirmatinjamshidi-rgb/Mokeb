namespace Mokeb.Application.CommandHandler.CaravanCommands.RemovePilgrim
{
    public class RemovePilgrimCommandResponse
    {
        public static RemovePilgrimCommandResponse Response() => new();
        public RemovePilgrimCommandResponse WithResult(bool result)
        {
            Result = result;
            return this;
        }
        public bool Result { get; set; }
    }
}
