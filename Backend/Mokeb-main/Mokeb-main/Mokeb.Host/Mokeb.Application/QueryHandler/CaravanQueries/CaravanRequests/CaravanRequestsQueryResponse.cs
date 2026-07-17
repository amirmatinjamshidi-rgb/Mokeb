using Mokeb.Application.Dtos;

namespace Mokeb.Application.QueryHandler.CaravanQueries.CaravanRequests
{
    public class CaravanRequestsQueryResponse
    {
        public static CaravanRequestsQueryResponse Response() => new();
        public CaravanRequestsQueryResponse WithRequests(List<RequestDto> requests)
        {
            Requests = requests;
            return this;
        }
        public List<RequestDto> Requests { get; set; }
    }
}
