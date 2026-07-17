using Mokeb.Common.Base.ApplicationExceptions;

namespace Mokeb.Application.Exceptions
{
    public class CaravanNotFoundExceptiopn : ObjectNotFoundApplicationException
    {
        public CaravanNotFoundExceptiopn() : base("کاروان پیدا نشد") { }
    }
}