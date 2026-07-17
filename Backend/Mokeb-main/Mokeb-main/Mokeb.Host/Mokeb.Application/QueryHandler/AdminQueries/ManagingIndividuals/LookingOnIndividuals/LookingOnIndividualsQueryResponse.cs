using Mokeb.Application.Dtos;

namespace Mokeb.Application.QueryHandler.AdminQueries.ManagingIndividuals.LookingOnIndividuals
{
    public class LookingOnIndividualsQueryResponse
    {
        public static LookingOnIndividualsQueryResponse Response()
        {
            return new LookingOnIndividualsQueryResponse();
        }
        public LookingOnIndividualsQueryResponse WithResponse(List<IndividualPrincipalDto> individualPrincipals)
        {
            IndividualPrincipals = individualPrincipals;
            return this;
        }
        public List<IndividualPrincipalDto> IndividualPrincipals { get; set; }
    }
}
