using MediatR;
using Mokeb.Application.Contracts;
using Mokeb.Application.Exceptions;
using Mokeb.Common.Base.ApplicationExceptions;
using Mokeb.Domain.Model.Entities;

namespace Mokeb.Application.CommandHandler.AdminCommands.AddingRoomAvailability
{
    public class AddingRoomAvailabilityCommandHandler : IRequestHandler<AddingRoomAvailabilityCommand, AddingRoomAvailabilityCommandResponse>
    {
        private readonly IRoomRepository _roomRepository;
        private readonly IUnitOfWork _unitOfWork;

        public AddingRoomAvailabilityCommandHandler(IRoomRepository roomRepository, IUnitOfWork unitOfWork)
        {
            _roomRepository = roomRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<AddingRoomAvailabilityCommandResponse> Handle(AddingRoomAvailabilityCommand request, CancellationToken cancellationToken)
        {
            await CheckAvailabilityOfThatDayExistance(request.roomId, request.DateOfAvailability, cancellationToken);
            var room = await GetRoom(request.roomId, cancellationToken);
            room.AddRoomAvailability(request.ToRoomAvailability(room.Capacity));

            var savingResult = await _unitOfWork.Commit(cancellationToken);
            savingResult.ThrowIfNoChanges<NoChangesApplicationException>();

            return AddingRoomAvailabilityCommandResponse.Succeeded;
        }
        #region
        private async Task<Room> GetRoom(Guid roomId, CancellationToken ct)
        {
            var room = await _roomRepository.GetRoomByIdAsync(roomId, ct);
            if (room is null)
                throw new RoomNotFoundException();
            return room;
        }
        private async Task CheckAvailabilityOfThatDayExistance(Guid roomId, DateOnly dateOfAvailability, CancellationToken ct)
        {
            var availabilityResult = await _roomRepository.CheckAvailabilityDayOfARoomAsync(roomId, dateOfAvailability, ct);
            if (availabilityResult)
                throw new ThisRoomIsAvailableAtThisDateException();
        }
        #endregion

    }
}
