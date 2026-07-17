using Mokeb.Application.Dtos;

namespace Mokeb.Application.QueryHandler.AdminQueries.ManagingCaravans.LookingOnCaravans
{
    public class LookingOnCaravansQueryResponse
    {
        public static LookingOnCaravansQueryResponse Response()
        {
            return new LookingOnCaravansQueryResponse();
        }
        public LookingOnCaravansQueryResponse WithResponse(List<CaravanPrincipalDto> caravanPrincipals)
        {
            CaravanPrincipals = caravanPrincipals;
            return this;
        }
        public List<CaravanPrincipalDto> CaravanPrincipals { get; set; }
    }
}
