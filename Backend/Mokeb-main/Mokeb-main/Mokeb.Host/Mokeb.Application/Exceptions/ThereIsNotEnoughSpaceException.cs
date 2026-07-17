using Mokeb.Common.Base.ApplicationExceptions;

namespace Mokeb.Application.Exceptions
{
    public class ThereIsNotEnoughSpaceException : InputIsWrongApplicationException
    {
        public ThereIsNotEnoughSpaceException() : base("There is not enough space for this amount of pilgrims") { }
    }
}