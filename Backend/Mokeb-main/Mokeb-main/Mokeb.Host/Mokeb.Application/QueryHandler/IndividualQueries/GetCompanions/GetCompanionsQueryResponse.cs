using Mokeb.Domain.Model.Entities;

namespace Mokeb.Application.QueryHandler.IndividualQueries.GetCompanions
{
    public class GetCompanionsQueryResponse
    {
        public static GetCompanionsQueryResponse Response() => new();
        public GetCompanionsQueryResponse WithCompanions(IEnumerable<Companion> companions)
        {
            Companions = companions;
            return this;
        }
        public IEnumerable<Companion> Companions { get; set; }
    }
}
