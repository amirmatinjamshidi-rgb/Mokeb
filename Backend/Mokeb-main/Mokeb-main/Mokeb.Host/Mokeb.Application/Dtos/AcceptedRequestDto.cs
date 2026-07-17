using Mokeb.Domain.Model.Enums;

namespace Mokeb.Application.Dtos
{
    public record AcceptedRequestDto
    {
        public AcceptedRequestDto(Guid id, DateOnly enterTime, DateOnly exitTime, State state)
        {
            Id = id;
            EnterTime = enterTime;
            ExitTime = exitTime;
            State = state;
        }

        public Guid Id { get; set; }
        public Guid RequestId => Id;
        public DateOnly EnterTime { get; set; }
        public DateOnly ExitTime { get; set; }
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
    }
}
