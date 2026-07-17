namespace Mokeb.Application.CommandHandler.OfficialsCommands.RemoveOfficials
{
    public class RemoveOfficialsCommandResponse
    {
        public static RemoveOfficialsCommandResponse Succeeded() => new();
        public RemoveOfficialsCommandResponse WithResult(bool result)
        {
            Result = result;
            return this;
        }
        public bool Result { get; set; }
    }
}
