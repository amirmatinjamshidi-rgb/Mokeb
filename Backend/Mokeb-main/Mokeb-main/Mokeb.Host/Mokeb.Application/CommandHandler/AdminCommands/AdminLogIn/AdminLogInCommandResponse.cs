namespace Mokeb.Application.CommandHandler.AdminCommands.AdminLogIn
{
    public class AdminLogInCommandResponse
    {
        public static AdminLogInCommandResponse Response(string jws) => new() { JwsCode = jws };
        public string JwsCode { get; set; }
    }
}
