using Mokeb.Common.Base.DomainExceptions;

namespace Mokeb.Domain.Model.Exceptions.CompanionExceptions
{
    public class CompanionAlreadyExistsException : ValidationFailedDomainException
    {
        public CompanionAlreadyExistsException() : base("Companion Already Exists") { }
    }
}