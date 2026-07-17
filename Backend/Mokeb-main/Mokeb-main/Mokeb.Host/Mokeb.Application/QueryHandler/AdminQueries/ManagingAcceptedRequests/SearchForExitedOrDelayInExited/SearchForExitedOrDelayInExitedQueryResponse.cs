using Mokeb.Application.Dtos;

namespace Mokeb.Application.QueryHandler.AdminQueries.ManagingAcceptedRequests.SearchForExitedOrDelayInExited
{
    public class SearchForExitedOrDelayInExitedQueryResponse
    {
        public static SearchForExitedOrDelayInExitedQueryResponse SucceededResponse(List<GettingOutGoingOrAcceptedRequestsResponseDto> response)
        {
            return new SearchForExitedOrDelayInExitedQueryResponse()
            {
                Response = response,
            };
        }

        public List<GettingOutGoingOrAcceptedRequestsResponseDto> Response { get; set; }
    }
}
