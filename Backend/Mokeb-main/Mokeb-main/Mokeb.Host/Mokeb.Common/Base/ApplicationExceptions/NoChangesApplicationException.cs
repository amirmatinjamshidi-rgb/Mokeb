namespace Mokeb.Common.Base.ApplicationExceptions
{
    public class NoChangesApplicationException : ApplicationException
    {
        public NoChangesApplicationException()
        {
        }

        public NoChangesApplicationException(string? message) : base(message)
        {
        }

        public NoChangesApplicationException(string? message, Exception? innerException) : base(message, innerException)
        {
        }
    }
}
