using Mokeb.Common.Base.DomainExceptions;

namespace Mokeb.Domain.Model.Exceptions.IndividualExceptions
{
    public class IndividualOverallCapacityException : ValidationFailedDomainException
    {
        public IndividualOverallCapacityException() : base("Individual Request Can't Have more than 5 members") { }
    }
}