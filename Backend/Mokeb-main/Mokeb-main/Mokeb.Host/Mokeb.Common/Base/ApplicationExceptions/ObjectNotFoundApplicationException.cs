namespace Mokeb.Common.Base.ApplicationExceptions
{
    public class ObjectNotFoundApplicationException : BaseException.ApplicationException
    {
        public ObjectNotFoundApplicationException()
        {
        }

        public ObjectNotFoundApplicationException(string? message) : base(message)
        {
        }

        public ObjectNotFoundApplicationException(string? message, Exception? innerException) : base(message, innerException)
        {
        }
    }
}
