namespace Mokeb.Application.CommandHandler.AdminCommands.DeleteCaravan
{
    public class DeleteCaravanCommandResponse
    {
        public static DeleteCaravanCommandResponse Response()
        {
            return new DeleteCaravanCommandResponse();
        }
        public DeleteCaravanCommandResponse WithResult(bool result)
        {
            Result = result;
            return this;
        }
        public bool Result { get; set; }
    }
}
