namespace Mokeb.Application.CommandHandler.OfficialsCommands.AddOfficials
{
    public class AddOfficialsCommandResponse
    {
        public static AddOfficialsCommandResponse Succeeded() => new();
        public AddOfficialsCommandResponse WithResult(bool result)
        {
            Result = result;
            return this;
        }
        public bool Result { get; set; }
    }
}
