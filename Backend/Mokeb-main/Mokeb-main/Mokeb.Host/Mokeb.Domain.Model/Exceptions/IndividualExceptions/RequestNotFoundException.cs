using Mokeb.Common.Base.DomainExceptions;

namespace Mokeb.Domain.Model.Exceptions.IndividualExceptions
{
    public class RequestNotFoundException : ObjectNotFoundDomainException
    {
        public RequestNotFoundException() : base("Request Not Found") { }
    }
}