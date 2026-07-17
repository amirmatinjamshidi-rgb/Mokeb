namespace Mokeb.Application.CommandHandler.PrincipalsLogOut
{
    public class PrincipalsLogOutCommandResponse
    {
        public static PrincipalsLogOutCommandResponse Succeeded => new() { Success = true };
        public bool Success { get; set; }
    }
}
