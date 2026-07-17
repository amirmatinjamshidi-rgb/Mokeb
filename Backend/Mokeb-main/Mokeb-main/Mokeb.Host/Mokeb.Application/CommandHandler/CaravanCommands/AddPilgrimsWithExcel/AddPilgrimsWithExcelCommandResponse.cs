namespace Mokeb.Application.CommandHandler.CaravanCommands.AddPilgrimsWithExcel
{
    public class AddPilgrimsWithExcelCommandResponse
    {
        public static AddPilgrimsWithExcelCommandResponse Response() => new();
        public AddPilgrimsWithExcelCommandResponse WithResult(bool result)
        {
            Result = result;
            return this;
        }
        public bool Result { get; set; }
    }
}
