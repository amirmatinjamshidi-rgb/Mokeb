using Mokeb.Application.Dtos;

namespace Mokeb.Application.QueryHandler.AdminQueries.BiennialBookingStats
{
    public class BiennialBookingStatsQueryResponse
    {
        public static BiennialBookingStatsQueryResponse Response() => new();
        public BiennialBookingStatsQueryResponse WithStats(BiennialBookingStatsDto stats)
        {
            Stats = stats;
            return this;
        }
        public BiennialBookingStatsDto Stats { get; set; }
    }
}
