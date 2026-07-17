using Mokeb.Application.Dtos;

namespace Mokeb.Application.QueryHandler.IndividualQueries.IndividualRequests
{
    public class IndividualRequestsQueryResponse
    {
        public static IndividualRequestsQueryResponse Response() => new();
        public IndividualRequestsQueryResponse WithRequests(List<RequestDto> requests)
        {
            Requests = requests;
            return this;
        }
        public List<RequestDto> Requests { get; set; }
    }
}
