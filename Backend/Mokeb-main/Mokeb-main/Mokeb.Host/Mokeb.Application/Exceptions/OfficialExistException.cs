using Mokeb.Common.Base.ApplicationExceptions;

namespace Mokeb.Application.Exceptions
{
    public class OfficialExistException : ObjectFoundApplicationException
    {
        public OfficialExistException() : base("مسعول موجود میباشد") { }
    }
}