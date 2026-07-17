using Mokeb.Application.Dtos;

namespace Mokeb.Application.QueryHandler.AdminQueries.AllTravelersGenderStaticsInAYear
{
    public class AllTravelersGenderStaticsInAYearQueryResponse
    {
        public static AllTravelersGenderStaticsInAYearQueryResponse Response() => new();
        public AllTravelersGenderStaticsInAYearQueryResponse WithResponse(GenderStatsInAYearDto stats)
        {
            Stats = stats;
            return this;
        }
        public GenderStatsInAYearDto Stats { get; set; }
    }
}
