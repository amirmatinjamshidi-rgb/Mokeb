using MediatR;
using Mokeb.Application.CommandHandler.Base.Extension;
using Mokeb.Application.QueryHandler.Base;

namespace Mokeb.Application.QueryHandler.AdminQueries.ManagingRequestedRequests.GettingRoomAvailabilitiesOnADateRange
{
    public class GettingRoomAvailabilitiesOnADateRangeQuery : QueryBase, IRequest<GettingRoomAvailabilitiesOnADateRangeQueryResponse>
    {
        public DateOnly EnterTime { get; set; }
        public DateOnly ExitTime { get; set; }
        public override void Validate()
        {
            new GettingRoomAvailabilitiesOnADateRangeQueryValidator().Validate(this).ThrowIfNeeded();
        }
    }
}
