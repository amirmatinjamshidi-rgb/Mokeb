using Mokeb.Application.Dtos;

namespace Mokeb.Application.QueryHandler.CaravanQueries.CaravanAcceptedRequests
{
    public class CaravanAcceptedRequestsQueryResponse
    {
        public static CaravanAcceptedRequestsQueryResponse Response() => new();
        public CaravanAcceptedRequestsQueryResponse WithRequests(List<AcceptedRequestDto> requests)
        {
            Requests = requests;
            return this;
        }
        public List<AcceptedRequestDto> Requests { get; set; }
    }
}
