using Mokeb.Common.Base.PresentationExceptions;

namespace Mokeb.Host.Exceptions
{
    public class TokenNotFoundException : AuthorizationFailedPresentationException
    {
        public TokenNotFoundException() : base("Token Is Expired !")
        {
        }
    }
}