using Mokeb.Application.Dtos;

namespace Mokeb.Application.QueryHandler.AdminQueries.ManagingRequestedRequests.LookingOnRequestedRequests
{
    public class LookingOnRequestedRequestsQueryResponse
    {
        public static LookingOnRequestedRequestsQueryResponse SucceededResponse() => new();
        public LookingOnRequestedRequestsQueryResponse WithRequests(List<RequestedRequestsDto> requests)
        {
            Requests = requests;
            return this;
        }
        public List<RequestedRequestsDto> Requests { get; set; }
    }
}
