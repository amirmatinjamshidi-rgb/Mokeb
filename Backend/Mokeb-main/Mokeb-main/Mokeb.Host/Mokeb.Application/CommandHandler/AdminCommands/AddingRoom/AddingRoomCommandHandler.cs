using MediatR;
using Mokeb.Application.Contracts;
using Mokeb.Application.Exceptions;
using Mokeb.Common.Base.ApplicationExceptions;

namespace Mokeb.Application.CommandHandler.AdminCommands.AddingRoom
{
    public partial class AddingRoomCommandHandler : IRequestHandler<AddingRoomCommand, AddingRoomCommandResponse>
    {
        private readonly IRoomRepository _roomRepository;
        private readonly IUnitOfWork _unitOfWork;

        public AddingRoomCommandHandler(IRoomRepository roomRepository, IUnitOfWork unitOfWork)
        {
            _roomRepository = roomRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<AddingRoomCommandResponse> Handle(AddingRoomCommand request, CancellationToken cancellationToken)
        {
            await CheckRoomExistance(request.Name, cancellationToken);
            var room = request.ToRoom();
            _roomRepository.AddRoom(room);
            var savingResult = await _unitOfWork.Commit(cancellationToken);
            savingResult.ThrowIfNoChanges<NoChangesApplicationException>();
            return AddingRoomCommandResponse.SucceededWithId(room.Id);
        }
        #region Private Methods
        private async Task CheckRoomExistance(string roomName, CancellationToken ct)
        {
            var roomExistanceResult = await _roomRepository.CheckRoomExistanceByNameAsync(roomName, ct);
            if (roomExistanceResult)
                throw new ThisRoomAlreadyExistException();
        }

        #endregion
    }
}
