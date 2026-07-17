using Mokeb.Common.Base.ApplicationExceptions;

namespace Mokeb.Application.Exceptions
{
    public class ReequestNotFoundException : ObjectNotFoundApplicationException
    {
        public ReequestNotFoundException() : base("Request Not Found") { }
    }
}
