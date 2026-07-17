using MediatR;
using Microsoft.EntityFrameworkCore;
using Mokeb.Application.CommandHandler.Base.Extension;
using Mokeb.Application.Contracts;
using Mokeb.Application.Exceptions;
using Mokeb.Domain.Model.Entities;
using Mokeb.Domain.Model.ValueObjects;
using ResponseModel = Mokeb.Application.CommandHandler.AdminCommands.AcceptingARequestedRequest.AcceptingARequestedRequestCommandResponse;

namespace Mokeb.Application.CommandHandler.AdminCommands.AcceptingARequestedRequest
{
    public class AcceptingARequestedRequestCommandHandler : IRequestHandler<AcceptingARequestedRequestCommand, AcceptingARequestedRequestCommandResponse>
    {
        private readonly ICaravanPrincipalRepository _caravanPrincipalRepository;
        private readonly IRoomRepository _roomRepository;
        private readonly IUnitOfWork _unitOfWork;

        public AcceptingARequestedRequestCommandHandler(ICaravanPrincipalRepository caravanPrincipalRepository, IUnitOfWork unitOfWork, IRoomRepository roomRepository)
        {
            _caravanPrincipalRepository = caravanPrincipalRepository;
            _unitOfWork = unitOfWork;
            _roomRepository = roomRepository;
        }

        public async Task<AcceptingARequestedRequestCommandResponse> Handle(AcceptingARequestedRequestCommand command, CancellationToken ct)
        {
            var request = await GetRequest(command.RequestId, ct);
            var roomAvailabilities = await GetRoomAvailabilities(command, ct);
            RoomAvailabilitiesCalculator.DecreaseFromRoomAvailableCapacity(roomAvailabilities, request.MaleCount, request.FemaleCount);
            var requestRoom = GetRequestRooms(roomAvailabilities);
            AddingRequestRoomsToRequest(requestRoom, request);
            request.ChangeToAccepted();
            try
            {
                await _unitOfWork.Commit(ct);
            }
            catch (DbUpdateConcurrencyException ex)
            {
                throw new ConcurrencyException();
            }
            return ResponseModel
                        .Succeded()
                        .WithResult(true);
        }

        private async Task<List<RoomAvailability>> GetRoomAvailabilities(AcceptingARequestedRequestCommand command, CancellationToken ct)
        {
            var roomAvailabilities = await _roomRepository.GetRoomAvailabilitiesByRoomAvailabilityIdsAsync(command.RoomAvailabilityIds, ct);
            if (roomAvailabilities.Count() == 0)
                throw new RoomAvailabilityNotFoundException();
            return roomAvailabilities;
        }
        #region Private Methods
        private async Task<Request> GetRequest(Guid requestId, CancellationToken ct)
        {
            var request = await _caravanPrincipalRepository.GetRequestByIdAsync(requestId, ct);
            if (request is null)
                throw new RequestNotFoundException();
            return request;
        }
        private List<RequestRoom> GetRequestRooms(List<RoomAvailability> roomAvailabilities)
        {
            return roomAvailabilities
                .DistinctBy(x => x.RoomId)
                .Select(x => new RequestRoom(x.RoomId, x.Room.Name))
                .ToList();
        }
        private void AddingRequestRoomsToRequest(List<RequestRoom> requestRooms, Request request)
        {
            foreach (var room in requestRooms)
                request.AddRequestRoom(room);
        }
        #endregion
    }
}
