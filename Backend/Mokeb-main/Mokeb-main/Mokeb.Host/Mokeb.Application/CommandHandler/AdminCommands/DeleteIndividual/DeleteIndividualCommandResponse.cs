namespace Mokeb.Application.CommandHandler.AdminCommands.DeleteIndividual
{
    public class DeleteIndividualCommandResponse
    {
        public static DeleteIndividualCommandResponse Response() => new();
        public DeleteIndividualCommandResponse WithResult(bool result)
        {
            Success = result;
            return this;
        }
        public bool Success { get; set; }
    }
}
