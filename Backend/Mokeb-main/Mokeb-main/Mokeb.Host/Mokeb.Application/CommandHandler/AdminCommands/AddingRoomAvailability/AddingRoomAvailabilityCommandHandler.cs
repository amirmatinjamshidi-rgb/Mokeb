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
            var room = await GetRoom(request.roomId, cancellationToken);
            var end = request.ExitDate ?? request.DateOfAvailability;
            var added = 0;

            for (var day = request.DateOfAvailability; day <= end; day = day.AddDays(1))
            {
                var alreadyExists = await _roomRepository.CheckAvailabilityDayOfARoomAsync(
                    request.roomId, day, cancellationToken);
                if (alreadyExists)
                    continue;

                room.AddRoomAvailability(new RoomAvailability(day, room.Capacity));
                added++;
            }

            // Idempotent: if every day already had availability, treat as success (no 500).
            if (added == 0)
                return AddingRoomAvailabilityCommandResponse.Succeeded;

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
        #endregion
    }
}
