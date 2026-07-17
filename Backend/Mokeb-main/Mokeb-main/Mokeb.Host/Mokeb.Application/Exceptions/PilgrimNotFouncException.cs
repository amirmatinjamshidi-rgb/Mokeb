using Mokeb.Common.Base.ApplicationExceptions;

namespace Mokeb.Application.Exceptions
{
    public class PilgrimNotFouncException : ObjectNotFoundApplicationException
    {
        public PilgrimNotFouncException() : base("زاعر یافت نشد")
        {

        }
    }
}