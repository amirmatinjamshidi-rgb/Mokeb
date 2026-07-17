using Mokeb.Domain.Model.Entities;
using Mokeb.Domain.Model.Enums;

namespace Mokeb.Application.Dtos
{
    public record RequestDto
    {
        public RequestDto(
            Guid id,
            DateOnly enterTime,
            DateOnly exitTime,
            int travelersAmount,
            int maleAmount,
            int femaleAmount,
            State state,
            IEnumerable<Travelers> travelers)
        {
            Id = id;
            EnterTime = enterTime;
            ExitTime = exitTime;
            TravelersAmount = travelersAmount;
            MaleAmount = maleAmount;
            FemaleAmount = femaleAmount;
            State = state;
            Travelers = travelers;
        }

        public Guid Id { get; set; }
        public Guid RequestId => Id;
        public DateOnly EnterTime { get; set; }
        public DateOnly ExitTime { get; set; }
        public int TravelersAmount { get; set; }
        public int MaleAmount { get; set; }
        public int FemaleAmount { get; set; }
        public State State { get; set; }
        public string StringState => State switch
        {
            State.Accepted => "تایید شده",
            State.Rejected => "رد شده",
            State.Requested => "در انتظار تایید",
            State.DelayInEntrance => "تاخیر در ورود",
            State.DelayInExit => "تاخیر در خروج",
            State.Entered => "وارد شده",
            State.Exited => "خارج شده",
            _ => "در انتظار تایید",
        };
        public IEnumerable<Travelers> Travelers { get; set; }
    }
}
