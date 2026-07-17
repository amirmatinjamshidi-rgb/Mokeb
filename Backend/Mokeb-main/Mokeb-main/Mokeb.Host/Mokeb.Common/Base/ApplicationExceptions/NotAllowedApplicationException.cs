namespace Mokeb.Common.Base.ApplicationExceptions
{
    public class NotAllowedApplicationException : BaseException.ApplicationException
    {
        public NotAllowedApplicationException()
        {
        }

        public NotAllowedApplicationException(string? message) : base(message)
        {
        }

        public NotAllowedApplicationException(string? message, Exception? innerException) : base(message, innerException)
        {
        }
    }
}
