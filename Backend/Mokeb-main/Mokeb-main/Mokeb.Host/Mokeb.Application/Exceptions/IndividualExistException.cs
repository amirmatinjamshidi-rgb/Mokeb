using Mokeb.Common.Base.ApplicationExceptions;

namespace Mokeb.Application.Exceptions
{
    public class IndividualExistException : ObjectFoundApplicationException
    {
        public IndividualExistException() : base("Individual with this NationalNumber or PassportNumber or Username Exist") { }
    }
}