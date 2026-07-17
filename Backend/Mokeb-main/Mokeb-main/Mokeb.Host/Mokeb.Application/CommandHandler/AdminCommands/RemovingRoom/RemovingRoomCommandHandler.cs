using MediatR;
using Mokeb.Application.Contracts;
using Mokeb.Application.Exceptions;
using Mokeb.Common.Base.ApplicationExceptions;

namespace Mokeb.Application.CommandHandler.AdminCommands.RemovingRoom
{
    public class RemovingRoomCommandHandler : IRequestHandler<RemovingRoomCommand, RemovingRoomCommandResponse>
    {
        private readonly IRoomRepository _roomRepository;
        private readonly IUnitOfWork _unitOfWork;

        public RemovingRoomCommandHandler(IRoomRepository roomRepository, IUnitOfWork unitOfWork)
        {
            _roomRepository = roomRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<RemovingRoomCommandResponse> Handle(RemovingRoomCommand request, CancellationToken cancellationToken)
        {
            await CheckRoomExistance(request.roomId, cancellationToken);
            var room = await _roomRepository.GetRoomByIdAsync(request.roomId, cancellationToken);
            _roomRepository.RemoveRoomById(room);
            var savingResult = await _unitOfWork.Commit(cancellationToken);
            savingResult.ThrowIfNoChanges<NoChangesApplicationException>();
            return RemovingRoomCommandResponse.Succeeded;
        }
        #region Private Methods
        public async Task CheckRoomExistance(Guid id, CancellationToken ct)
        {
            var roomExistanceResult = await _roomRepository.CheckRoomExistanceByIdAsync(id, ct);
            if (!roomExistanceResult)
                throw new RoomNotFoundException();
            ;
        }
        #endregion
    }
}
