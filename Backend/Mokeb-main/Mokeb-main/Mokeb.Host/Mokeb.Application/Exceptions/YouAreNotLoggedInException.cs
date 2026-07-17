using Mokeb.Common.Base.ApplicationExceptions;

namespace Mokeb.Application.Exceptions
{
    public class YouAreNotLoggedInException : AuthorizationWithTokenFailedApplicationException
    {
        public YouAreNotLoggedInException() : base("You Are Not Logged In No Token Found in Header") { }
    }
}