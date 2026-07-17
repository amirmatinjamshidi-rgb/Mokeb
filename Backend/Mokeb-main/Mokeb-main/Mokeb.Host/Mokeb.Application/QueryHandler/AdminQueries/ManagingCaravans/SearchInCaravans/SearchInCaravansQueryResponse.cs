using Mokeb.Application.Dtos;

namespace Mokeb.Application.QueryHandler.AdminQueries.ManagingCaravans.SearchInCaravans
{
    public class SearchInCaravansQueryResponse
    {
        public static SearchInCaravansQueryResponse Response()
        {
            return new SearchInCaravansQueryResponse();
        }
        public SearchInCaravansQueryResponse WithResponse(List<CaravanPrincipalDto> caravanPrincipals)
        {
            CaravanPrincipals = caravanPrincipals;
            return this;
        }
        public List<CaravanPrincipalDto> CaravanPrincipals { get; set; }
    }
}
