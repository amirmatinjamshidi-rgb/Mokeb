namespace Mokeb.Application.CommandHandler.AdminCommands.ChangingCaravansPrincipal
{
    public class ChangingCaravansPrincipalCommandResponse
    {
        public static ChangingCaravansPrincipalCommandResponse Response() => new();
        public ChangingCaravansPrincipalCommandResponse WithResult(bool result)
        {
            Success = result;
            return this;
        }
        public bool Success { get; set; }
    }
}
