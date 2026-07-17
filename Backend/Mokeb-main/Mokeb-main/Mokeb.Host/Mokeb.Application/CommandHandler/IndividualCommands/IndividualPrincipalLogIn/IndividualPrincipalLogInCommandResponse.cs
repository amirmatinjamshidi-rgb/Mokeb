namespace Mokeb.Application.CommandHandler.IndividualCommands.IndividualPrincipalLogIn
{
    public class IndividualPrincipalLogInCommandResponse
    {
        public static IndividualPrincipalLogInCommandResponse Response(string jws) => new() { JwsCode = jws };
        public string JwsCode { get; set; }
    }
}
