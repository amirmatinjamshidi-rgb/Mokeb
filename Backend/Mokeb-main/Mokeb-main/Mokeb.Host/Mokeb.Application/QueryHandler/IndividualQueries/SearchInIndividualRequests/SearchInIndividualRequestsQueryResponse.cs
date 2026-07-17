using Mokeb.Application.Dtos;

namespace Mokeb.Application.QueryHandler.IndividualQueries.SearchInIndividualRequests
{
    public class SearchInIndividualRequestsQueryResponse
    {
        public static SearchInIndividualRequestsQueryResponse Response() => new();
        public SearchInIndividualRequestsQueryResponse WithRequests(List<RequestDto> requests)
        {
            Requests = requests;
            return this;
        }
        public List<RequestDto> Requests { get; set; }
    }
}
