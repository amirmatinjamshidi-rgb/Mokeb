using Mokeb.Domain.Model.Enums;

namespace Mokeb.Application.Dtos
{
    public class RequestedRequestsDto
    {
        public RequestedRequestsDto(string name, string familyName, string phoneNumber, uint maleCount, uint femaleCount,
                    DateOnly enterTime, DateOnly exitTime, Guid requestId, State requestState)
        {
            Name = name;
            FamilyName = familyName;
            PhoneNumber = phoneNumber;
            MaleCount = maleCount;
            FemaleCount = femaleCount;
            EnterTime = enterTime;
            ExitTime = exitTime;
            RequestId = requestId;
            RequestState = requestState;
        }

        public Guid RequestId { get; set; }
        public Guid Id => RequestId;
        public string Name { get; set; }
        public string FamilyName { get; set; }
        public string FullName => $"{Name} {FamilyName}".Trim();
        public string SupervisorName => FullName;
        public string PhoneNumber { get; set; }
        public string Mobile => PhoneNumber;
        public uint MaleCount { get; set; }
        public uint FemaleCount { get; set; }
        public uint MaleAmount => MaleCount;
        public uint FemaleAmount => FemaleCount;
        public uint OverallCount => MaleCount + FemaleCount;
        public uint TotalCapacity => OverallCount;
        public DateOnly EnterTime { get; set; }
        public DateOnly ExitTime { get; set; }
        public DateOnly EntranceDate => EnterTime;
        public DateOnly ExitDate => ExitTime;
        public State RequestState { get; set; }
        public State State => RequestState;
        public string StringState => RequestState switch
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
