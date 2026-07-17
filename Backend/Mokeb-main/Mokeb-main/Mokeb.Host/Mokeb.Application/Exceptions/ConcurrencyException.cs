using Mokeb.Common.Base.ApplicationExceptions;

namespace Mokeb.Application.Exceptions
{
    public class ConcurrencyException : NoChangesApplicationException
    {
        public ConcurrencyException() : base("ظرفیت اتاق‌ها در لحظه تغییر کرد. لطفاً مجدداً تلاش کنید.") { }
    }
}