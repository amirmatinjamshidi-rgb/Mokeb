using Mokeb.Common.Base.DomainExceptions;

namespace Mokeb.Domain.Model.Exceptions.CaravanExceptions
{
    internal class PhoneNumberIsInvalidException : ValidationFailedDomainException
    {
        public PhoneNumberIsInvalidException() : base("PhoneNumber Is Invalid")
        {
        }
    }
}