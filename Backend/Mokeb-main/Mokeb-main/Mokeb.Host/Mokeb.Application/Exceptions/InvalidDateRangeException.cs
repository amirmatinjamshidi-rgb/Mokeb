using Mokeb.Common.Base.ApplicationExceptions;

namespace Mokeb.Application.Exceptions
{
    public class InvalidDateRangeException : InputIsWrongApplicationException
    {
        public InvalidDateRangeException() : base("تاریخ ورود جدید نمی‌تواند بعد از تاریخ خروج باشد.") { }
    }
}