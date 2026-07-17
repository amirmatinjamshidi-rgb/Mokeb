namespace Mokeb.Common.Base.ApplicationExceptions
{
    public class ObjectFoundApplicationException : ApplicationException
    {
        public ObjectFoundApplicationException()
        {
        }

        public ObjectFoundApplicationException(string? message) : base(message)
        {
        }

        public ObjectFoundApplicationException(string? message, Exception? innerException) : base(message, innerException)
        {
        }
    }
}
