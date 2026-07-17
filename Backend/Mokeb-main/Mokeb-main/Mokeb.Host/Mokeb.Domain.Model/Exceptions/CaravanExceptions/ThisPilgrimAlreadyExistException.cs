using Mokeb.Common.Base.DomainExceptions;

namespace Mokeb.Domain.Model.Exceptions.CaravanExceptions
{
    public class ThisPilgrimAlreadyExistException : ObjectAlreadyExistDomainException
    {
        public ThisPilgrimAlreadyExistException() : base("Pilgrim Is Already In Your Pilgrims") { }
    }
}