namespace Mokeb.Application.CommandHandler.CaravanCommands.CaravanPrincipalLogIn
{
    public class CaravanPrincipalLogInCommandResponse
    {
        public static CaravanPrincipalLogInCommandResponse Response(string jws) => new() { JwsCode = jws };
        public string JwsCode { get; set; }
    }
}
