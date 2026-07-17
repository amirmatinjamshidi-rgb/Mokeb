using Mokeb.Application.Dtos;

namespace Mokeb.Application.QueryHandler.AdminQueries.ManagingAcceptedRequests.GettingPrincipalInformation
{
    public class GettingPrincipalInformationQueryResponse
    {
        public static GettingPrincipalInformationQueryResponse Response(PrincipalDto principal)
        {
            return new GettingPrincipalInformationQueryResponse() { Principal = principal };
        }
        public PrincipalDto Principal { get; set; }
    }
}
