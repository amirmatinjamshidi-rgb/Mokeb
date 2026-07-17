namespace Mokeb.Application.CommandHandler.AdminCommands.EditFAQ
{
    public class EditFAQCommandResponse
    {
        public static EditFAQCommandResponse Response() => new();
        public EditFAQCommandResponse WithResult(bool result)
        {
            Success = result;
            return this;
        }
        public bool Success { get; set; }
    }
}
