using Mokeb.Application.Dtos;

namespace Mokeb.Application.QueryHandler.AdminQueries.ManagingAcceptedRequests.SearchForEnteredOrDelayInEntrance
{
    public class SearchForEnteredOrDelayInEntranceQueryResponse
    {
        public static SearchForEnteredOrDelayInEntranceQueryResponse SucceededResponse(List<GettingIncomingOrAcceptedRequestsResponseDto> response)
        {
            return new SearchForEnteredOrDelayInEntranceQueryResponse()
            {
                Response = response,
            };
        }

        public List<GettingIncomingOrAcceptedRequestsResponseDto> Response { get; set; }
    }
}
