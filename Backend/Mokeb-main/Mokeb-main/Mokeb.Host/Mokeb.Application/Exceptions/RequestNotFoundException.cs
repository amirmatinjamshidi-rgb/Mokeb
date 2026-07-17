using Mokeb.Common.Base.ApplicationExceptions;

namespace Mokeb.Application.Exceptions
{
    public class RequestNotFoundException : ObjectNotFoundApplicationException
    {
        public RequestNotFoundException() : base("درخواست رزرو یافت نشد") { }
    }
}