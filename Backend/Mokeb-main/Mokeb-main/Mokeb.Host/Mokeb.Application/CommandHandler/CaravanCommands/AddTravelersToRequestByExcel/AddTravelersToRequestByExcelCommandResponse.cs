namespace Mokeb.Application.CommandHandler.CaravanCommands.AddTravelersToRequestByExcel
{
    public class AddTravelersToRequestByExcelCommandResponse
    {
        public static AddTravelersToRequestByExcelCommandResponse Response() => new();
        public AddTravelersToRequestByExcelCommandResponse WithResult(bool result)
        {
            Result = result;
            return this;
        }
        public bool Result { get; set; }
    }
}
