using Mokeb.Application.Dtos;

namespace Mokeb.Application.QueryHandler.AdminQueries.ManagingOfficials.GetAllOfficials
{
    public class GetAllOfficialsQueryResponse
    {
        public static GetAllOfficialsQueryResponse Response() => new();
        public GetAllOfficialsQueryResponse WithOfficials(List<OfficialsDto> officials)
        {
            Officials = officials;
            return this;
        }
        public List<OfficialsDto> Officials { get; set; }
    }
}
