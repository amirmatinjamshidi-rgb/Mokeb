namespace Mokeb.Application.CommandHandler.AdminCommands.ChangingExitDateOfAPrincipal
{
    public class ChangingExitDateOfAPrincipalCommandResponse
    {
        public static ChangingExitDateOfAPrincipalCommandResponse Succeded() => new();
        public ChangingExitDateOfAPrincipalCommandResponse WithResult(bool result)
        {
            Success = result;
            return this;
        }
        public bool Success { get; set; }
    }
}
