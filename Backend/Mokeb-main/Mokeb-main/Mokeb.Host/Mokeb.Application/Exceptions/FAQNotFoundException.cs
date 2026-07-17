using Mokeb.Common.Base.ApplicationExceptions;

namespace Mokeb.Application.Exceptions
{
    public class FAQNotFoundException : ObjectNotFoundApplicationException
    {
        public FAQNotFoundException() : base("سوال یافت نشد") { }
    }
}