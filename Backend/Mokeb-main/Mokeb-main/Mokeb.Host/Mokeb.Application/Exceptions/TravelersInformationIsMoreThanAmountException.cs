using Mokeb.Common.Base.ApplicationExceptions;

namespace Mokeb.Application.Exceptions
{
    public class TravelersInformationIsMoreThanAmountException : InputValidationFailedApplicationException
    {
        public TravelersInformationIsMoreThanAmountException() : base("اطلاعات وارد شده بیشتر از تعداد مسافران اعلام شده است")
        {

        }
    }
}