namespace Mokeb.Application.CommandHandler.OfficialsCommands.EditOfficials
{
    public class EditOfficialsCommandResponse
    {
        public static EditOfficialsCommandResponse Response() => new();
        public EditOfficialsCommandResponse WithResult(bool result)
        {
            Result = result;
            return this;
        }
        public bool Result { get; set; }
    }
}
