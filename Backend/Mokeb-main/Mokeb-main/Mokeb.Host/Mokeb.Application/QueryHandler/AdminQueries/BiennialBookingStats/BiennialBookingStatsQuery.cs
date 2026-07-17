using MediatR;
using Mokeb.Application.CommandHandler.Base.Extension;
using Mokeb.Application.QueryHandler.Base;

namespace Mokeb.Application.QueryHandler.AdminQueries.BiennialBookingStats
{
    public class BiennialBookingStatsQuery : QueryBase, IRequest<BiennialBookingStatsQueryResponse>
    {
        public string Year { get; set; }
        public override void Validate()
        {
            new BiennialBookingStatsQueryValidator().Validate(this).ThrowIfNeeded();
        }
    }
}
