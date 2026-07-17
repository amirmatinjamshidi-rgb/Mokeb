using MediatR;
using Mokeb.Application.Contracts;
using Mokeb.Application.Exceptions;
using Mokeb.Common.Base.ApplicationExceptions;
using Mokeb.Domain.Model.Entities;

namespace Mokeb.Application.CommandHandler.AdminCommands.RemovingRoomAvailability
{
    public class UpdatingRoomAvailabilityDateCommandHandler : IRequestHandler<UpdatingRoomAvailabilityDateCommand, UpdatingRoomAvailabilityDateCommandResponse>
    {
        private readonly IRoomRepository _roomRepository;
        private readonly IUnitOfWork _unitOfWork;

        public UpdatingRoomAvailabilityDateCommandHandler(IRoomRepository roomRepository, IUnitOfWork unitOfWork)
        {
            _roomRepository = roomRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<UpdatingRoomAvailabilityDateCommandResponse> Handle(UpdatingRoomAvailabilityDateCommand request, CancellationToken cancellationToken)
        {
            var availableRoom = await GetAvailableRoom(request.AvailabilityId, cancellationToken);
            availableRoom.ChangeAvailableDate(request.NewDate);

            var result = await _unitOfWork.Commit(cancellationToken);
            result.ThrowIfNoChanges<NoChangesApplicationException>();

            return UpdatingRoomAvailabilityDateCommandResponse.Succeeded;
        }
        #region Private Methods
        private async Task<RoomAvailability> GetAvailableRoom(Guid availableRoomId, CancellationToken ct)
        {
            var roomAvailability = await _roomRepository.GetRoomAvailabilityByIdAsync(availableRoomId, ct);
            if (roomAvailability == null)
                throw new RoomAvailabilityNotFoundException();
            return roomAvailability;
        }
        #endregion
    }
}
