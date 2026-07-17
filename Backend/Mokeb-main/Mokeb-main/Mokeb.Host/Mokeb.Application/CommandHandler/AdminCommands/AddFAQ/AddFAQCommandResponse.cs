namespace Mokeb.Application.CommandHandler.AdminCommands.AddFAQ
{
    public class AddFAQCommandResponse
    {
        public static AddFAQCommandResponse Response() => new();
        public AddFAQCommandResponse WithResult(bool result)
        {
            Result = result;
            return this;
        }
        public bool Result { get; set; }
    }
}
