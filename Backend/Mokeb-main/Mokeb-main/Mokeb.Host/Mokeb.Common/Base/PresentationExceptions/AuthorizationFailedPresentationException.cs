using Mokeb.Common.Base.PresentationExceptions.BaseException;

namespace Mokeb.Common.Base.PresentationExceptions
{
    public class AuthorizationFailedPresentationException : PresentationException
    {
        public AuthorizationFailedPresentationException()
        {
        }

        public AuthorizationFailedPresentationException(string? message) : base(message)
        {
        }

        public AuthorizationFailedPresentationException(string? message, Exception? innerException) : base(message, innerException)
        {
        }
    }
}
