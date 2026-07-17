using Mokeb.Common.Base.DomainExceptions;

namespace Mokeb.Domain.Model.Exceptions.CaravanExceptions
{
    public class UsernameIsInvalidException : ValidationFailedDomainException
    {
        public UsernameIsInvalidException() : base("Username Can't Be Empty") { }
    }
}
