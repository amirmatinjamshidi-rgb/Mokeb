namespace Mokeb.Common.Base.ApplicationExceptions
{
    public class AuthorizationWithTokenFailedApplicationException : ApplicationException
    {
        public AuthorizationWithTokenFailedApplicationException()
        {
        }

        public AuthorizationWithTokenFailedApplicationException(string? message) : base(message)
        {
        }

        public AuthorizationWithTokenFailedApplicationException(string? message, Exception? innerException) : base(message, innerException)
        {
        }
    }
}
