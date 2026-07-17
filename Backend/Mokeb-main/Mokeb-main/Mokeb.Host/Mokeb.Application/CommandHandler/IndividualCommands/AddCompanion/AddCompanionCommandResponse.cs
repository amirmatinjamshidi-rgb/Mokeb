namespace Mokeb.Application.CommandHandler.IndividualCommands.AddCompanion
{
    public class AddCompanionCommandResponse
    {
        public static AddCompanionCommandResponse Response() => new();
        public AddCompanionCommandResponse WithResult(bool result)
        {
            Result = result;
            return this;
        }
        public bool Result { get; set; }
    }
}
