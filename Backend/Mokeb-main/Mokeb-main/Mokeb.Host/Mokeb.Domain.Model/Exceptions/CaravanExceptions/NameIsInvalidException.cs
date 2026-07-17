using Mokeb.Common.Base.DomainExceptions;

namespace Mokeb.Domain.Model.Exceptions.CaravanExceptions
{
    public class NameIsInvalidException : ValidationFailedDomainException
    {
        public NameIsInvalidException() : base("Name Can't Be Empty")
        {
        }

    }
}