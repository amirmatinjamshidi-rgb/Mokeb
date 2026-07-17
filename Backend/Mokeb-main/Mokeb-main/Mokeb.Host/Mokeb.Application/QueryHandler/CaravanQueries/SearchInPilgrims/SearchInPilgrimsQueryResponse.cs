using Mokeb.Domain.Model.Entities;

namespace Mokeb.Application.QueryHandler.CaravanQueries.SearchInPilgrims
{
    public class SearchInPilgrimsQueryResponse
    {
        public static SearchInPilgrimsQueryResponse Response() => new();
        public SearchInPilgrimsQueryResponse WithPilgrims(List<Pilgrim> pilgrims)
        {
            Pilgrims = pilgrims;
            return this;
        }
        public List<Pilgrim> Pilgrims { get; set; }
    }
}
