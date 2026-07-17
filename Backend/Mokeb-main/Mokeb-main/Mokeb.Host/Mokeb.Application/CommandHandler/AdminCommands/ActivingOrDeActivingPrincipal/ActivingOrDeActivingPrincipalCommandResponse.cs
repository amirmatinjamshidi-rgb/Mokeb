namespace Mokeb.Application.CommandHandler.AdminCommands.ActivingPrincipal
{
    public class ActivingOrDeActivingPrincipalCommandResponse
    {
        public static ActivingOrDeActivingPrincipalCommandResponse Response() => new();
        public ActivingOrDeActivingPrincipalCommandResponse WithResult(bool result)
        {
            Result = result;
            return this;
        }
        public bool Result { get; set; }
    }
}
