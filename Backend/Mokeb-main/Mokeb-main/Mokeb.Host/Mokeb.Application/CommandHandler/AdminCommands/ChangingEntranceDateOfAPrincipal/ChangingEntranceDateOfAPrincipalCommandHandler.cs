using MediatR;
using Microsoft.EntityFrameworkCore;
using Mokeb.Application.CommandHandler.Base.Extension;
using Mokeb.Application.Contracts;
using Mokeb.Application.Exceptions;
using Mokeb.Domain.Model.Entities;
using System.Data;
using ResponseModel = Mokeb.Application.CommandHandler.AdminCommands.ChangingEntranceDateOfACaravan.ChangingEntranceDateOfAPrincipalCommandResponse;

namespace Mokeb.Application.CommandHandler.AdminCommands.ChangingEntranceDateOfACaravan
{
    public class ChangingEntranceDateOfAPrincipalCommandHandler : IRequestHandler<ChangingEntranceDateOfAPrincipalCommand, ChangingEntranceDateOfAPrincipalCommandResponse>
    {
        private readonly IRoomRepository _roomRepository;
        private readonly IIndividualRepository _individualRepository;
        private readonly ICaravanPrincipalRepository _caravanPrincipalRepository;
        private readonly IUnitOfWork _unitOfWork;

        public ChangingEntranceDateOfAPrincipalCommandHandler(IRoomRepository roomRepository, IIndividualRepository individualRepository,
                                                                ICaravanPrincipalRepository caravanPrincipalRepository, IUnitOfWork unitOfWork)
        {
            _roomRepository = roomRepository;
            _individualRepository = individualRepository;
            _caravanPrincipalRepository = caravanPrincipalRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<ChangingEntranceDateOfAPrincipalCommandResponse> Handle(ChangingEntranceDateOfAPrincipalCommand command, CancellationToken ct)
        {
            var request = await GetRequest(command.RequestId, ct);
            var oldEnterTime = DateOnly.FromDateTime(request.EnterTime);
            var oldExitTime = DateOnly.FromDateTime(request.ExitTime);
            var oldDateList = oldEnterTime.GetRangeTo(oldExitTime);

            var roomIds = request.Rooms.Select(r => r.Id).ToList();
            var oldRoomAvailabilities = await GetRoomAvailabilities(roomIds, oldDateList, ct);
            RoomAvailabilitiesCalculator.IncreaseRoomAvailableCapacity(oldRoomAvailabilities, request.MaleCount, request.FemaleCount);

            var newEnterTime = command.Date;
            EnterAndExitTimeValidation(newEnterTime, oldExitTime);
            var newDateList = newEnterTime.GetRangeTo(oldExitTime);
            var newRoomAvailabilities = await GetRoomAvailabilities(roomIds, newDateList, ct);
            RoomAvailabilitiesCalculator.DecreaseFromRoomAvailableCapacity(newRoomAvailabilities, request.MaleCount, request.FemaleCount);
            request.ChangeEnterTime(newEnterTime.ToDateTime(TimeOnly.MinValue));
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
        #region Private Methods
        private async Task<Request> GetRequest(Guid requestId, CancellationToken ct)
        {
            var caravanRequest = await _caravanPrincipalRepository.GetRequestByIdAsync(requestId, ct);
            if (caravanRequest is null)
            {
                var individualRequest = await _individualRepository.GetRequestByIdAsync(requestId, ct);
                if (individualRequest is null)
                    throw new RequestNotFoundException();
                return individualRequest;
            }
            return caravanRequest;
        }
        private void EnterAndExitTimeValidation(DateOnly enterTime, DateOnly exitTime)
        {
            if (enterTime >= exitTime)
                throw new InvalidDateRangeException();
        }
        private async Task<List<RoomAvailability>> GetRoomAvailabilities(List<Guid> roomIds, List<DateOnly> dateRange, CancellationToken ct)
        {
            var roomAvailabilities = await _roomRepository.GetAvailabilitiesByRoomIdsAndDatesAsync(roomIds, dateRange, ct);
            return roomAvailabilities;
        }
        #endregion
    }
}
