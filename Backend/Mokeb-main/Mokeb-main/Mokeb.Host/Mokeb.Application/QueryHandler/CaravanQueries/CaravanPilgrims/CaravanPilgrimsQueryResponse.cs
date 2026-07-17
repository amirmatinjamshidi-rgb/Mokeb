using Mokeb.Domain.Model.Entities;

namespace Mokeb.Application.QueryHandler.CaravanQueries.CaravanPilgrims
{
    public class CaravanPilgrimsQueryResponse
    {
        public static CaravanPilgrimsQueryResponse Response() => new();
        public CaravanPilgrimsQueryResponse WithPilgrims(List<Pilgrim> pilgrims)
        {
            Pilgrims = pilgrims;
            return this;
        }
        public List<Pilgrim> Pilgrims { get; set; }
    }
}
