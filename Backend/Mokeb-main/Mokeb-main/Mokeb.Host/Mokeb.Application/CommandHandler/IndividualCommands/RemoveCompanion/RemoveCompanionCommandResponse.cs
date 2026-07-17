namespace Mokeb.Application.CommandHandler.IndividualCommands.RemoveCompanion
{
    public class RemoveCompanionCommandResponse
    {
        public static RemoveCompanionCommandResponse Response() => new();
        public RemoveCompanionCommandResponse WithResult(bool result)
        {
            Result = result;
            return this;
        }
        public bool Result { get; set; }
    }
}
