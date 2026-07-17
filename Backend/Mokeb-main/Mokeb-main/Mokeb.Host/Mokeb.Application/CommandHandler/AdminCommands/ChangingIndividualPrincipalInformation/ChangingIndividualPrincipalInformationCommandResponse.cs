namespace Mokeb.Application.CommandHandler.AdminCommands.ChangingIndividualPrincipalInformation
{
    public class ChangingIndividualPrincipalInformationCommandResponse
    {
        public static ChangingIndividualPrincipalInformationCommandResponse Response() => new();
        public ChangingIndividualPrincipalInformationCommandResponse WithResult(bool result)
        {
            Result = result;
            return this;
        }
        public bool Result { get; set; }
    }
}
