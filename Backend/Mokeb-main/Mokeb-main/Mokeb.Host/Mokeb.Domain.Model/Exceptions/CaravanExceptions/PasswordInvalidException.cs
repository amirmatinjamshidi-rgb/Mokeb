using Mokeb.Common.Base.DomainExceptions;

namespace Mokeb.Domain.Model.Exceptions.CaravanExceptions
{
    public class PasswordInvalidException : ValidationFailedDomainException
    {
        public PasswordInvalidException() : base("Password Is Invalid")
        {
        }
    }
}