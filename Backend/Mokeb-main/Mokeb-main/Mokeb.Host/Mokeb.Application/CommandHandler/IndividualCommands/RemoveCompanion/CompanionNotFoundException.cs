
using Mokeb.Common.Base.ApplicationExceptions;

namespace Mokeb.Application.CommandHandler.IndividualCommands.RemoveCompanion
{
    public class CompanionNotFoundException : ObjectNotFoundApplicationException
    {
        public CompanionNotFoundException() : base("همسفر یافت نشد") { }
    }
}