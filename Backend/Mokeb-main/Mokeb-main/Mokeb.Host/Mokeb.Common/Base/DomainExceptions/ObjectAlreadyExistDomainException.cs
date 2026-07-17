using Mokeb.Common.Base.DomainExceptions.BaseException;

namespace Mokeb.Common.Base.DomainExceptions
{
    public class ObjectAlreadyExistDomainException : DomainException
    {
        public ObjectAlreadyExistDomainException()
        {
        }

        public ObjectAlreadyExistDomainException(string? message) : base(message)
        {
        }

        public ObjectAlreadyExistDomainException(string? message, Exception? innerException) : base(message, innerException)
        {
        }
    }
}
