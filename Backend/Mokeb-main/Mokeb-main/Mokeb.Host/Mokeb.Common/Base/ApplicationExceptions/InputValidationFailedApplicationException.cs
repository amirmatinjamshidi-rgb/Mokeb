namespace Mokeb.Common.Base.ApplicationExceptions
{
    public class InputValidationFailedApplicationException : ApplicationException
    {
        public InputValidationFailedApplicationException()
        {
        }

        public InputValidationFailedApplicationException(string? message) : base(message)
        {
        }

        public InputValidationFailedApplicationException(string? message, Exception? innerException) : base(message, innerException)
        {
        }
    }
}
