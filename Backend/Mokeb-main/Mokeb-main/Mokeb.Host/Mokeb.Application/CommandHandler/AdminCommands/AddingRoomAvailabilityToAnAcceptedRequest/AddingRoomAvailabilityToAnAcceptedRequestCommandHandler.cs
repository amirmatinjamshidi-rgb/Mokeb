using MediatR;
using Mokeb.Application.CommandHandler.Base.Extension;
using Mokeb.Application.Contracts;
using Mokeb.Application.Exceptions;
using Mokeb.Common.Base.ApplicationExceptions;
using Mokeb.Domain.Model.Entities;
using Mokeb.Domain.Model.Enums;
using Mokeb.Domain.Model.ValueObjects;

namespace Mokeb.Application.CommandHandler.AdminCommands.IncreasingRequestsNumberOfPeople
{
    public class AddingRoomAvailabilityToAnAcceptedRequestCommandHandler : IRequestHandler<AddingRoomAvailabilityToAnAcceptedRequestCommand, AddingRoomAvailabilityToAnAcceptedRequestCommandResponse>
    {
        private readonly IRoomRepository _roomRepository;
        private readonly ICaravanPrincipalRepository _caravanPrincipalRepository;
        private readonly IUnitOfWork _unitOfWork;

        public AddingRoomAvailabilityToAnAcceptedRequestCommandHandler(IRoomRepository roomRepository, ICaravanPrincipalRepository caravanPrincipalRepository, IUnitOfWork unitOfWork)
        {
            _roomRepository = roomRepository;
            _caravanPrincipalRepository = caravanPrincipalRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<AddingRoomAvailabilityToAnAcceptedRequestCommandResponse> Handle(AddingRoomAvailabilityToAnAcceptedRequestCommand command, CancellationToken ct)
        {
            var request = await GetRequest(command.RequestId, ct);
            var roomAvailability = await GetRoomAvailability(command.RoomAvailabilityId, ct);
            var room = await GetRoom(roomAvailability.RoomId, ct);
            await DecreasingFromAvailabilityOfARoom(roomAvailability.RoomId, DateOnly.FromDateTime(request.EnterTime), DateOnly.FromDateTime(request.ExitTime), command.Amount, ct);
            request.AddRequestRoom(new RequestRoom(room.Id, room.Name));
            AddAmountToRequest(request, room, command.Amount);
            var savingResult = await _unitOfWork.Commit(ct);
            savingResult.ThrowIfNoChanges<NoChangesApplicationException>();
            return AddingRoomAvailabilityToAnAcceptedRequestCommandResponse.Succeeded;
        }
        #region Private Methods
        private async Task<Request> GetRequest(Guid Id, CancellationToken ct)
        {
            var request = await _caravanPrincipalRepository.GetRequestByIdAsync(Id, ct);
            if (request == null)
                throw new ReequestNotFoundException();
            return request;
        }
        private async Task<Room> GetRoom(Guid Id, CancellationToken ct)
        {
            var room = await _roomRepository.GetRoomByIdAsync(Id, ct);
            if (room is null)
                throw new RoomNotFoundException();
            return room;
        }
        private async Task<RoomAvailability> GetRoomAvailability(Guid Id, CancellationToken ct)
        {
            var room = await _roomRepository.GetRoomAvailabilityByIdAsync(Id, ct);
            if (room == null)
                throw new RoomAvailabilityNotFoundException();
            return room;
        }
        private async Task DecreasingFromAvailabilityOfARoom(Guid roomId, DateOnly enterTime, DateOnly exitTime, uint amount, CancellationToken ct)
        {
            var listOfDates = enterTime.GetRangeTo(exitTime);
            var availabilities = await _roomRepository.GetAvailabilitiesByRoomIdAndDatesAsync(roomId, listOfDates, ct);

            foreach (var date in listOfDates)
            {
                var availability = availabilities.FirstOrDefault(x => x.AvailableDay == date);

                if (availability is null)
                    throw new RoomAvailabilityNotFoundException();
                if (availability.AvailableCapacity < amount)
                    throw new ThereIsNotEnoughSpaceException();
                availability.RemoveFromCapacity(amount);
            }
        }
        private void AddAmountToRequest(Request request, Room room, uint amount)
        {
            if (room.Gender is Gender.Male)
                request.IncreaseMaleCount(amount);
            request.IncreaseFemaleCount(amount);
        }
        #endregion
    }
}
