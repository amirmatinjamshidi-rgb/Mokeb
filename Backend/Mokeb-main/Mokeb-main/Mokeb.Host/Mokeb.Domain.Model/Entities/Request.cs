using Mokeb.Domain.Model.Base;
using Mokeb.Domain.Model.Enums;
using Mokeb.Domain.Model.Exceptions.RequestExceptions;
using Mokeb.Domain.Model.ValueObjects;

namespace Mokeb.Domain.Model.Entities
{
    public class Request : BaseEntity<Guid>
    {
        private List<Travelers> _travelers = new List<Travelers>();
        public Request(uint maleCount, uint femaleCount, DateTime enterTime, DateTime exitTime)
        {
            MaleCount = maleCount;
            FemaleCount = femaleCount;
            EnterTime = enterTime;
            ExitTime = exitTime;
        }

        public uint MaleCount { get; private set; }
        public uint FemaleCount { get; private set; }
        public DateTime EnterTime { get; private set; }
        public DateTime ExitTime { get; private set; }
        public State State { get; private set; } = State.Requested;
        public DateTime? DateOfAcceptingRequest { get; private set; }
        public List<RequestRoom> Rooms { get; private set; } = new List<RequestRoom>();

        public IEnumerable<Travelers> Travelers => _travelers.AsReadOnly();


        #region Behaviors
        public void ChangeToAccepted()
        {
            DateOfAcceptingRequest = DateTime.Now;
            State = State.Accepted;
        }
        public void ChangeToRejected()
        {
            State = State.Rejected;
        }
        public void ChangeToRequested()
        {
            State = State.Requested;
        }
        public void ChangeToDelayInEntrance()
        {
            State = State.DelayInEntrance;
        }
        public void ChangeToDelayInExit()
        {
            State = State.DelayInExit;
        }
        public void AddTravelers(Travelers travelers)
        {
            if (_travelers.Any(x => x == travelers))
                throw new TravelersExistsException();
            _travelers.Add(travelers);
        }
        public void RemoveTravelers(Travelers travelers)
        {
            if (!_travelers.Any(x => x == travelers))
                throw new TravelersNotExistsException();
            _travelers.Remove(travelers);
        }
        public void AddRequestRoom(RequestRoom room)
        {
            if (Rooms.Any(x => x == room))
                throw new RequestRoomAlreadyExistException();
            Rooms.Add(room);
        }
        public void RemoveRequestRoom(RequestRoom room)
        {
            if (!Rooms.Any(x => x == room))
                throw new RequestRoomNotFoundException();
            Rooms.Remove(room);
        }
        public void IncreaseMaleCount(uint amount) => MaleCount += amount;
        public void IncreaseFemaleCount(uint amount) => FemaleCount += amount;
        public void DecreaseMaleCount(uint amount) => MaleCount -= amount;
        public void DecreaseFemaleCount(uint amount) => FemaleCount -= amount;
        public void ChangeEnterTime(DateTime enterTime) => EnterTime = enterTime;
        public void ChangeExitTime(DateTime exitTime) => ExitTime = exitTime;
        #endregion
    }
}
