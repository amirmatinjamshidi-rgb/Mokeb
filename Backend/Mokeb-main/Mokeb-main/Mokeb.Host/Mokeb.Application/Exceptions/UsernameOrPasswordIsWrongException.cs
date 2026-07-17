using Mokeb.Common.Base.ApplicationExceptions;

namespace Mokeb.Application.Exceptions
{
    public class UsernameOrPasswordIsWrongException : InputIsWrongApplicationException
    {
        public UsernameOrPasswordIsWrongException() : base("Username Or Password Is wrong") { }
    }
}