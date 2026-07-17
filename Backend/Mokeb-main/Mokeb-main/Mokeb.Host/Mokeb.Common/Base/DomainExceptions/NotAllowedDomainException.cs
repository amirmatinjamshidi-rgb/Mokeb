using Mokeb.Common.Base.DomainExceptions.BaseException;

namespace Mokeb.Common.Base.DomainExceptions
{
    public class NotAllowedDomainException : DomainException
    {
        public NotAllowedDomainException()
        {
        }

        public NotAllowedDomainException(string? message) : base(message)
        {
        }

        public NotAllowedDomainException(string? message, Exception? innerException) : base(message, innerException)
        {
        }
    }
}
