using Mokeb.Common.Base.DomainExceptions;

namespace Mokeb.Domain.Model.Exceptions.CaravanExceptions
{
    public class CaravanIsOutOfTimeException : NotAllowedDomainException
    {
        public CaravanIsOutOfTimeException() : base("Convoy Is Out Of ProcessTime")
        {
        }
    }
}