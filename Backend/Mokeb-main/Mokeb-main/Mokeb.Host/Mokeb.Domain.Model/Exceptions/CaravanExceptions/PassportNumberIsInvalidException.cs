using Mokeb.Common.Base.DomainExceptions;

namespace Mokeb.Domain.Model.Exceptions.CaravanExceptions
{
    public class PassportNumberIsInvalidException : ValidationFailedDomainException
    {
        public PassportNumberIsInvalidException() : base("Passport Number Can't Be Empty") { }
    }
}