using Mokeb.Common.Base.ApplicationExceptions;

namespace Mokeb.Application.Exceptions
{
    public class CarvanExistException : ObjectFoundApplicationException
    {
        public CarvanExistException() : base("Individual with this NationalNumber or PassportNumber or Username Exist")
        {
        }
    }
}