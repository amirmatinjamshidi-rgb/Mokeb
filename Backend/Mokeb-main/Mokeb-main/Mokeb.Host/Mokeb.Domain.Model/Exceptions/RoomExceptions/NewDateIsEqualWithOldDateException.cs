using Mokeb.Common.Base.DomainExceptions;

namespace Mokeb.Domain.Model.Exceptions.RoomExceptions
{
    public class NewDateIsEqualWithOldDateException : NoChangesDomainException
    {
        public NewDateIsEqualWithOldDateException() : base("New Date can't be equal with old date") { }
    }
}
