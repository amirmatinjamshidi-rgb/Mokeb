using Mokeb.Common.Base.DomainExceptions;

namespace Mokeb.Domain.Model.Exceptions.CaravanExceptions
{
    public class PilgrimNotFoundException : ObjectNotFoundDomainException
    {
        public PilgrimNotFoundException() : base("Pilgrim Not Found In Your Pilgrims") { }
    }
}