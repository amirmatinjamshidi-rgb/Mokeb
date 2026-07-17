using Mokeb.Common.Base.ApplicationExceptions;

namespace Mokeb.Application.Exceptions
{
    public class OfficialNotFoundException : ObjectNotFoundApplicationException
    {
        public OfficialNotFoundException() : base("مسعول پیدا شد") { }
    }
}