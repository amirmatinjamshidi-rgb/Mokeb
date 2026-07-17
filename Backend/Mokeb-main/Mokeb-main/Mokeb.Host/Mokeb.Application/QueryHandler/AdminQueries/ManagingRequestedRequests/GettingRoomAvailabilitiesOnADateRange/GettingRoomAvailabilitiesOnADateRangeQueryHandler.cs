using MediatR;
using Mokeb.Application.CommandHandler.Base.Extension;
using Mokeb.Application.Contracts;
using Mokeb.Domain.Model.Enums;
using ResponseModel = Mokeb.Application.QueryHandler.AdminQueries.ManagingRequestedRequests.GettingRoomAvailabilitiesOnADateRange.GettingRoomAvailabilitiesOnADateRangeQueryResponse;

namespace Mokeb.Application.QueryHandler.AdminQueries.ManagingRequestedRequests.GettingRoomAvailabilitiesOnADateRange
{
    public class GettingRoomAvailabilitiesOnADateRangeQueryHandler : IRequestHandler<GettingRoomAvailabilitiesOnADateRangeQuery, GettingRoomAvailabilitiesOnADateRangeQueryResponse>
    {
        private readonly IRoomRepository _roomRepository;

        public GettingRoomAvailabilitiesOnADateRangeQueryHandler(IRoomRepository roomRepository)
        {
            _roomRepository = roomRepository;
        }

        public async Task<ResponseModel> Handle(GettingRoomAvailabilitiesOnADateRangeQuery query, CancellationToken ct)
        {
            var listOfDates = query.EnterTime.GetRangeTo(query.ExitTime);
            var roomAvailabilities = await _roomRepository.GetRoomAvailabilitiesAtDatesAsync(listOfDates, ct);

            var maleRoomAvailabilities = roomAvailabilities.Where(x => x.Gender == Gender.Male).ToList();
            var femaleRoomAvailabilities = roomAvailabilities.Where(x => x.Gender == Gender.Female).ToList();
            return ResponseModel
                .Response()
                .WithRoomAvailabilities(maleRoomAvailabilities, femaleRoomAvailabilities);
        }
    }
}
