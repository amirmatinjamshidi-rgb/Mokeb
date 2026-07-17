using Mokeb.Common.Base.ApplicationExceptions;

namespace Mokeb.Application.Exceptions
{
    public class YouAreNotAllowedException : NotAllowedApplicationException
    {
        public YouAreNotAllowedException() : base("شما برای این عملیات مجاز نیستید")
        {
        }
    }
}