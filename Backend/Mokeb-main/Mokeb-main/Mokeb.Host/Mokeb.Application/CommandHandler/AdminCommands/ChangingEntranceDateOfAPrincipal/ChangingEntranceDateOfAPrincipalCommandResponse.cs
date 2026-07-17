namespace Mokeb.Application.CommandHandler.AdminCommands.ChangingEntranceDateOfACaravan
{
    public class ChangingEntranceDateOfAPrincipalCommandResponse
    {
        public static ChangingEntranceDateOfAPrincipalCommandResponse Succeded() => new();
        public ChangingEntranceDateOfAPrincipalCommandResponse WithResult(bool result)
        {
            Success = result;
            return this;
        }
        public bool Success { get; set; }
    }
}
