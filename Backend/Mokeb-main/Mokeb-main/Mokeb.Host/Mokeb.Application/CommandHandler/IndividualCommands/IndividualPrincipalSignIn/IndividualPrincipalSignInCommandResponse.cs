namespace Mokeb.Application.CommandHandler.IndividualCommands.IndividualPrincipalSignIn
{
    public class IndividualPrincipalSignInCommandResponse
    {
        public static IndividualPrincipalSignInCommandResponse Succeeded => new() { Success = true };
        public bool Success { get; set; }
    }
}
