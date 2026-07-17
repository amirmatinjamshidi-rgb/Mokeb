namespace Mokeb.Application.CommandHandler.PrincipalsChangePassword
{
    public class PrincipalsChangePasswordCommandResponse
    {
        public static PrincipalsChangePasswordCommandResponse Response() => new();
        public PrincipalsChangePasswordCommandResponse WithResult(bool result)
        {
            Result = result;
            return this;
        }
        public bool Result { get; set; }
    }
}
