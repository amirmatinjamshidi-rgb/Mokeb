using MediatR;
using Mokeb.Application.Contracts;
using ResponseModel = Mokeb.Application.QueryHandler.AdminQueries.GetRoomAvailabilitiesInADate.GetRoomAvailabilitiesInADateQueryResponse;

namespace Mokeb.Application.QueryHandler.AdminQueries.GetRoomAvailabilitiesInADate
{
    public class GetRoomAvailabilitiesInADateQueryHandler : IRequestHandler<GetRoomAvailabilitiesInADateQuery, GetRoomAvailabilitiesInADateQueryResponse>
    {
        private readonly IRoomRepository _roomRepository;

        public GetRoomAvailabilitiesInADateQueryHandler(IRoomRepository roomRepository)
        {
            _roomRepository = roomRepository;
        }

        public async Task<GetRoomAvailabilitiesInADateQueryResponse> Handle(GetRoomAvailabilitiesInADateQuery request, CancellationToken cancellationToken)
        {
            var roomAvailabilitiesInformation = await _roomRepository.GetRoomAvailabilitiesInformationInADateAsync(request.Date, cancellationToken);
            return ResponseModel
                .Response()
                .WithRoomAvailabilities(roomAvailabilitiesInformation);
        }
    }
}
