
using Mokeb.Common.Base.ApplicationExceptions;

namespace Mokeb.Application.CommandHandler.PrincipalsChangePassword
{
    public class PasswordIsInvalidException : InputIsWrongApplicationException
    {
        public PasswordIsInvalidException() : base("رمز گذشته اشتباه است") { }
    }
}