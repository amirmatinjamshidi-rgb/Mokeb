using Mokeb.Domain.Model.Entities;

namespace Mokeb.Application.CommandHandler.IndividualCommands.ReserveRoom
{
    public class ReserveRoomCommandResponse
    {
        public static ReserveRoomCommandResponse Response() => new();
        public ReserveRoomCommandResponse WithTravelers(List<Travelers> travelers)
        {
            Travelers = travelers;
            return this;
        }
        public ReserveRoomCommandResponse WithEntranceTime(DateTime entranceTime)
        {
            EntraceTime = entranceTime;
            return this;
        }
        public ReserveRoomCommandResponse WithExitTime(DateTime exitTime)
        {
            ExitTime = exitTime;
            return this;
        }
        public List<Travelers> Travelers { get; set; }
        public DateTime EntraceTime { get; set; }
        public DateTime ExitTime { get; set; }

    }
}
