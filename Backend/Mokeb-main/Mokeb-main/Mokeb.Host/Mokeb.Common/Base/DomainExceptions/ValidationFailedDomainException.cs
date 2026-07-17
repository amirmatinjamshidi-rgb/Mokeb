using Mokeb.Common.Base.DomainExceptions.BaseException;

namespace Mokeb.Common.Base.DomainExceptions
{
    public class ValidationFailedDomainException : DomainException
    {
        public ValidationFailedDomainException()
        {
        }

        public ValidationFailedDomainException(string? message) : base(message)
        {
        }

        public ValidationFailedDomainException(string? message, Exception? innerException) : base(message, innerException)
        {
        }
    }
}
