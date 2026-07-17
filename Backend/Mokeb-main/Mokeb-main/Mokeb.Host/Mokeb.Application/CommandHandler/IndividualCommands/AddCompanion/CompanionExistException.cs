
using Mokeb.Common.Base.ApplicationExceptions;

namespace Mokeb.Application.CommandHandler.IndividualCommands.AddCompanion
{
    public class CompanionExistException : ObjectFoundApplicationException
    {
        public CompanionExistException() : base("همسفر قبلا اضافه شده است")
        {

        }
    }
}