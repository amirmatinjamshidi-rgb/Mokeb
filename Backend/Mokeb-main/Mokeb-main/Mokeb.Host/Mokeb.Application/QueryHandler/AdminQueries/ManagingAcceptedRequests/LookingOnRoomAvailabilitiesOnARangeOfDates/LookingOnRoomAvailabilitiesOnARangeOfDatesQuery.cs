using MediatR;
using Mokeb.Application.QueryHandler.Base;

namespace Mokeb.Application.QueryHandler.AdminQueries.ManagingAcceptedRequests.LookingOnRoomAvailabilitiesOnARangeOfDates
{
    public class LookingOnRoomAvailabilitiesOnARangeOfDatesQuery : QueryBase, IRequest<LookingOnRoomAvailabilitiesOnARangeOfDatesQueryResponse>
    {
        public Guid RequestId { get; set; }
        public override void Validate()
        {
            throw new NotImplementedException();
        }
    }
}
