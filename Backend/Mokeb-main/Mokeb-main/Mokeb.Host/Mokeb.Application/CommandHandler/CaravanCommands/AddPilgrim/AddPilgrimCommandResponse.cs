namespace Mokeb.Application.CommandHandler.CaravanCommands.AddPilgrim
{
    public class AddPilgrimCommandResponse
    {
        public static AddPilgrimCommandResponse Response() => new();
        public AddPilgrimCommandResponse WithResult(bool result)
        {
            Result = result;
            return this;
        }
        public bool Result { get; set; }
    }
}
