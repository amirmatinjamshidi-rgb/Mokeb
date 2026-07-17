using Mokeb.Common.Base.DomainExceptions;

namespace Mokeb.Domain.Model.Exceptions.CaravanExceptions
{
    public class FamilyNameIsInvalidException : ValidationFailedDomainException
    {
        public FamilyNameIsInvalidException() : base("FamilyName Can't Be Empty") { }
    }
}