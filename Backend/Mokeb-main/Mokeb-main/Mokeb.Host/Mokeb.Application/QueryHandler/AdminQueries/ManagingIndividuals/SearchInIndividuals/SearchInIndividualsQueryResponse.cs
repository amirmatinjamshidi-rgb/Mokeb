using Mokeb.Application.Dtos;

namespace Mokeb.Application.QueryHandler.AdminQueries.ManagingIndividuals.SearchInIndividuals
{
    public class SearchInIndividualsQueryResponse
    {
        public static SearchInIndividualsQueryResponse Response()
        {
            return new SearchInIndividualsQueryResponse();
        }
        public SearchInIndividualsQueryResponse WithResponse(List<IndividualPrincipalDto> individualPrincipals)
        {
            IndividualPrincipals = individualPrincipals;
            return this;
        }
        public List<IndividualPrincipalDto> IndividualPrincipals { get; set; }
    }
}
