using MediatR;
using Mokeb.Application.CommandHandler.Base.Extension;
using Mokeb.Application.Contracts;
using Mokeb.Application.Dtos;
using Mokeb.Application.Exceptions;
using Mokeb.Domain.Model.Entities;
using Mokeb.Domain.Model.Enums;

namespace Mokeb.Application.QueryHandler.AdminQueries.ManagingAcceptedRequests.LookingOnRoomAvailabilitiesOnARangeOfDates
{
    public class LookingOnRoomAvailabilitiesOnARangeOfDatesQueryHandler : IRequestHandler<LookingOnRoomAvailabilitiesOnARangeOfDatesQuery, LookingOnRoomAvailabilitiesOnARangeOfDatesQueryResponse>
    {
        private readonly IRoomRepository _roomRepository;
        private readonly ICaravanPrincipalRepository _caravanPrincipalRepository;

        public LookingOnRoomAvailabilitiesOnARangeOfDatesQueryHandler(IRoomRepository roomRepository, ICaravanPrincipalRepository caravanPrincipalRepository)
        {
            _roomRepository = roomRepository;
            _caravanPrincipalRepository = caravanPrincipalRepository;
        }

        public async Task<LookingOnRoomAvailabilitiesOnARangeOfDatesQueryResponse> Handle(LookingOnRoomAvailabilitiesOnARangeOfDatesQuery query, CancellationToken ct)
        {
            var request = await GetRequest(query.RequestId, ct);
            var requestRoomIds = request.Rooms.Select(r => r.Id).ToList();
            var roomAvailabilities = await GetRoomAvailabilities(requestRoomIds, DateOnly.FromDateTime(request.EnterTime), DateOnly.FromDateTime(request.ExitTime), ct);
            var maleAvailableRooms = roomAvailabilities.Where(x => x.Gender == Gender.Male).ToList();
            var femaleAvailableRooms = roomAvailabilities.Where(x => x.Gender == Gender.Female).ToList();

            return LookingOnRoomAvailabilitiesOnARangeOfDatesQueryResponse.ToResponse(maleAvailableRooms, femaleAvailableRooms);
        }
        #region Private Methods
        private async Task<Request> GetRequest(Guid Id, CancellationToken ct)
        {
            var request = await _caravanPrincipalRepository.GetRequestByIdAsync(Id, ct);
            if (request == null)
                throw new ReequestNotFoundException();
            return request;
        }
        private async Task<List<RoomAvailabilityDto>> GetRoomAvailabilities(List<Guid> roomIds, DateOnly enterDate, DateOnly exitDate, CancellationToken ct)
        {
            var listOfDates = enterDate.GetRangeTo(exitDate);
            return await _roomRepository.GetDistinctRoomAvailabilitesFromEnteredRoomIdList(roomIds, listOfDates, ct);

        }
        #endregion
    }
}
