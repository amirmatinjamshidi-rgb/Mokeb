using Mokeb.Common.Base.ApplicationExceptions;

namespace Mokeb.Application.Exceptions
{
    public class PrincipalNotFoundApplicationException : ObjectNotFoundApplicationException
    {
        public PrincipalNotFoundApplicationException() : base("Principal Not Found") { }
    }
}