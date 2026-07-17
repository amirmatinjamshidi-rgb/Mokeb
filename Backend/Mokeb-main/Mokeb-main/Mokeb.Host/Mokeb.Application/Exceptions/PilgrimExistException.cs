using Mokeb.Common.Base.ApplicationExceptions;

namespace Mokeb.Application.Exceptions
{
    public class PilgrimExistException : ObjectFoundApplicationException
    {
        public PilgrimExistException() : base("زاعر از  قبل موجود است")
        {

        }
    }
}