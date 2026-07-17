using Mokeb.Common.Base.DomainExceptions.BaseException;

namespace Mokeb.Common.Base.DomainExceptions
{
    public class NoChangesDomainException : DomainException
    {
        public NoChangesDomainException() { }

        public NoChangesDomainException(string? message) : base(message)
        {
        }

        public NoChangesDomainException(string? message, Exception? innerException) : base(message, innerException)
        {
        }
    }
}
