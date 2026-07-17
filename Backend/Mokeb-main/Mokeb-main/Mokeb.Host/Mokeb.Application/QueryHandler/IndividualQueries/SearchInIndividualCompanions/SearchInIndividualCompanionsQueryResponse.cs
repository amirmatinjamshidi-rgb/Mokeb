using Mokeb.Domain.Model.Entities;

namespace Mokeb.Application.QueryHandler.IndividualQueries.SearchInIndividualCompanions
{
    public class SearchInIndividualCompanionsQueryResponse
    {
        public static SearchInIndividualCompanionsQueryResponse Response() => new();
        public SearchInIndividualCompanionsQueryResponse WithCompanions(List<Companion> companions)
        {
            Companions = companions;
            return this;
        }
        public List<Companion> Companions { get; set; }
    }
}
