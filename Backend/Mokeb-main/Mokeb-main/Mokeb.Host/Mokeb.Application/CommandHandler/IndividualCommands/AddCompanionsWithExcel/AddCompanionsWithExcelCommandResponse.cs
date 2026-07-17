namespace Mokeb.Application.CommandHandler.IndividualCommands.AddCompanionsWithExcel
{
    public class AddCompanionsWithExcelCommandResponse
    {
        public static AddCompanionsWithExcelCommandResponse Response() => new();
        public AddCompanionsWithExcelCommandResponse WithResult(bool result)
        {
            Result = result;
            return this;
        }
        public bool Result { get; set; }
    }
}
