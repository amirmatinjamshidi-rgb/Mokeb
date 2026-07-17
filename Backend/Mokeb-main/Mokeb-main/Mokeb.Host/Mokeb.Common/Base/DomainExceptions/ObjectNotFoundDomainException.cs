using Mokeb.Common.Base.DomainExceptions.BaseException;

namespace Mokeb.Common.Base.DomainExceptions
{
    public class ObjectNotFoundDomainException : DomainException
    {
        public ObjectNotFoundDomainException()
        {
        }

        public ObjectNotFoundDomainException(string? message) : base(message)
        {
        }

        public ObjectNotFoundDomainException(string? message, Exception? innerException) : base(message, innerException)
        {
        }
    }
}
