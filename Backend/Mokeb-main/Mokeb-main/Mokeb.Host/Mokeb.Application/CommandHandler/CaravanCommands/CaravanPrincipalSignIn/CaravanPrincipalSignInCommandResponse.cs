namespace Mokeb.Application.CommandHandler.CaravanCommands.CaravanPrincipalSignIn
{
    public class CaravanPrincipalSignInCommandResponse
    {
        public static CaravanPrincipalSignInCommandResponse Succeeded => new() { Success = true };
        public bool Success { get; set; }
    }
}
