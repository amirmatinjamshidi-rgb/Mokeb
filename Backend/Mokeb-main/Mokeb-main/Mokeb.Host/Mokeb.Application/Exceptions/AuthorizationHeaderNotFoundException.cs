using Mokeb.Common.Base.ApplicationExceptions;

namespace Mokeb.Application.Exceptions
{
    public class AuthorizationHeaderNotFoundException : AuthorizationWithTokenFailedApplicationException
    {
        public AuthorizationHeaderNotFoundException() : base("Authorization Field In Header Not Found") { }
    }
}