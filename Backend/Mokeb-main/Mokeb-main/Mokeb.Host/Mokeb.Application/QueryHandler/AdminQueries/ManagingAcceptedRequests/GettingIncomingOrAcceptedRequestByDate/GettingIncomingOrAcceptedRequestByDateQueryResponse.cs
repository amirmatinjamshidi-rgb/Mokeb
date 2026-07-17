using Mokeb.Application.Dtos;

namespace Mokeb.Application.QueryHandler.AdminQueries.ManagingAcceptedRequests.GettingIncomingOrAcceptedRequestByDate
{
    public class GettingIncomingOrAcceptedRequestByDateQueryResponse
    {
        public static GettingIncomingOrAcceptedRequestByDateQueryResponse SucceededResponse(List<GettingIncomingOrAcceptedRequestsResponseDto> response)
        {
            return new GettingIncomingOrAcceptedRequestByDateQueryResponse()
            {
                Response = response,
            };
        }

        public List<GettingIncomingOrAcceptedRequestsResponseDto> Response { get; set; }
    }
}
