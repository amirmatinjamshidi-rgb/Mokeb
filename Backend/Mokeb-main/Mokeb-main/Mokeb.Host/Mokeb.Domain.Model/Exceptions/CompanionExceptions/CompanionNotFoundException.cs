using Mokeb.Common.Base.DomainExceptions;

namespace Mokeb.Domain.Model.Exceptions.CompanionExceptions
{
    public class CompanionNotFoundException : ValidationFailedDomainException
    {
        public CompanionNotFoundException() : base("Companion Not Found")
        {
        }
    }
}