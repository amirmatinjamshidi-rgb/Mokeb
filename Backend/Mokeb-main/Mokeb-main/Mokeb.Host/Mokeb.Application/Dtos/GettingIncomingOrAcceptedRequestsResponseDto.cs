using Mokeb.Domain.Model.Entities;

namespace Mokeb.Application.Dtos
{
    public class GettingIncomingOrAcceptedRequestsResponseDto
    {
        public GettingIncomingOrAcceptedRequestsResponseDto(string fullName, uint maleCount, uint femaleCount, DateOnly exitDate, IEnumerable<Travelers> travelers, Guid requestId)
        {
            FullName = fullName;
            MaleCount = maleCount;
            FemaleCount = femaleCount;
            ExitDate = exitDate;
            Travelers = travelers;
            RequestId = requestId;
        }
        public Guid RequestId { get; set; }
        public Guid Id => RequestId;
        public string FullName { get; set; }
        public string SupervisorName => FullName;
        public uint MaleCount { get; set; }
        public uint FemaleCount { get; set; }
        public uint MaleAmount => MaleCount;
        public uint FemaleAmount => FemaleCount;
        public uint OverallCount => MaleCount + FemaleCount;
        public uint TotalCapacity => OverallCount;
        public string PrincipalType => OverallCount > 5 ? "Caravan" : "Individual";
        public string ReservationType => PrincipalType == "Caravan" ? "کاروان" : "انفرادی";
        public DateOnly ExitDate { get; set; }
        public DateOnly ExitTime => ExitDate;
        public string StringState => "تایید شده";
        public int State => 0;
        public IEnumerable<Travelers> Travelers { get; set; }
    }
}
