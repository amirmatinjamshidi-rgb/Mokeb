using Mokeb.Common.Base.DomainExceptions;

namespace Mokeb.Domain.Model.Exceptions.CaravanExceptions
{
    public class CaravanIsNotAllowedException : NotAllowedDomainException
    {
        public CaravanIsNotAllowedException() : base("Convoy Is not allowed in this state")
        {
        }
    }
}
