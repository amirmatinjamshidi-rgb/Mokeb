namespace Mokeb.Common.Base.ApplicationExceptions
{
    public class InputIsWrongApplicationException : ApplicationException
    {
        public InputIsWrongApplicationException()
        {
        }

        public InputIsWrongApplicationException(string? message) : base(message)
        {
        }

        public InputIsWrongApplicationException(string? message, Exception? innerException) : base(message, innerException)
        {
        }
    }
}
