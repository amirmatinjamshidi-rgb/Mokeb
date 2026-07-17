using Mokeb.Application.Dtos;

namespace Mokeb.Application.QueryHandler.AdminQueries.ManagingAcceptedRequests.GettingOutGoingOrAcceptedRequestsByDate
{
    public class GettingOutGoingOrAcceptedRequestsByDateQueryResponse
    {
        public static GettingOutGoingOrAcceptedRequestsByDateQueryResponse SucceededResponse(List<GettingOutGoingOrAcceptedRequestsResponseDto> response)
        {
            return new GettingOutGoingOrAcceptedRequestsByDateQueryResponse()
            {
                Response = response,
            };
        }

        public List<GettingOutGoingOrAcceptedRequestsResponseDto> Response { get; set; }
    }
}
