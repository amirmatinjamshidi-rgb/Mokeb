using MediatR;
using Mokeb.Application.CommandHandler.Base.Extension;
using Mokeb.Application.Contracts;
using Mokeb.Application.Exceptions;
using Mokeb.Common.Base.ApplicationExceptions;
using Mokeb.Domain.Model.Entities;
using Mokeb.Domain.Model.Enums;
using Mokeb.Domain.Model.ValueObjects;
using ResponseModel = Mokeb.Application.CommandHandler.IndividualCommands.ReserveRoom.ReserveRoomCommandResponse;
namespace Mokeb.Application.CommandHandler.IndividualCommands.ReserveRoom
{
    public class ReserveRoomCommandHandler : IRequestHandler<ReserveRoomCommand, ReserveRoomCommandResponse>
    {
        private readonly IRoomRepository _roomRepository;
        private readonly IIndividualRepository _individualRepository;
        private readonly IUnitOfWork _unitOfWork;

        public ReserveRoomCommandHandler(IRoomRepository roomRepository, IIndividualRepository individualRepository, IUnitOfWork unitOfWork)
        {
            _roomRepository = roomRepository;
            _individualRepository = individualRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<ReserveRoomCommandResponse> Handle(ReserveRoomCommand request, CancellationToken cancellationToken)
        {
            var individual = await GetIndividualPrincipal(request.IndividualId, cancellationToken);
            CheckIndividualGender(request, individual);

            var reservedDates = DateOnly.FromDateTime(request.DateOfEntrance).GetRangeTo(DateOnly.FromDateTime(request.DateOfExit));
            var availableRooms = await _roomRepository.GetRoomAvailabilities(reservedDates, cancellationToken);

            RoomAvailabilitiesCalculator.DecreaseFromRoomAvailableCapacity(availableRooms, (uint)request.MaleAmount, (uint)request.FemaleAmount);

            var individualRequest = MakeRequestAndAddItToIndividual(request, individual);
            GetChangedRoomAvailabilitiesAndAddTheirNameToIndividual(individualRequest);
            individualRequest.AddTravelers(individual.ToTravelers());
            AddTravelersToCompanionAndRequestTravelers(request, individual, individualRequest);
            individualRequest.ChangeToAccepted();


            var savingResult = await _unitOfWork.Commit(cancellationToken);
            savingResult.ThrowIfNoChanges<NoChangesApplicationException>();


            return ResponseModel
                .Response()
                .WithTravelers(individualRequest.Travelers.ToList())
                .WithEntranceTime(request.DateOfEntrance)
                .WithExitTime(request.DateOfExit);
        }


        #region Private Methods
        private async Task<IndividualPrincipal> GetIndividualPrincipal(Guid individualId, CancellationToken ct)
        {
            var individual = await _individualRepository.GetIndividualByIdAsync(individualId, ct);
            if (individual is null)
                throw new PrincipalNotFoundApplicationException();
            return individual!;
        }
        private void CheckIndividualGender(ReserveRoomCommand request, IndividualPrincipal individual)
        {
            //request.MaleAmount += (individual.Gender == Gender.Male).AsInt();
            //request.FemaleAmount += (individual.Gender == Gender.Female).AsInt();
            if (individual.Gender == Gender.Male)
                request.MaleAmount++;
            else
                request.FemaleAmount++;
        }
        private static void AddTravelersToCompanionAndRequestTravelers(ReserveRoomCommand request, IndividualPrincipal individual, Request individualRequest)
        {
            foreach (var travelerDto in request.Travelers)
            {
                individualRequest.AddTravelers(travelerDto.ToTravelers());
                if (individual.Companion.Any(x => x.NationalCode == travelerDto.NationalCode))
                    continue;
                individual.AddCompanion(travelerDto.ToCompanion(individual.Id));
            }
        }

        private void GetChangedRoomAvailabilitiesAndAddTheirNameToIndividual(Request individualRequest)
        {
            var changedRoomAvailabilities = _unitOfWork.ChangedRoomAvailabilities();
            foreach (var room in changedRoomAvailabilities)
            {
                individualRequest.AddRequestRoom(new RequestRoom(room.Room.Id, room.Room.Name));
            }
        }

        private static Request MakeRequestAndAddItToIndividual(ReserveRoomCommand request, IndividualPrincipal individual)
        {
            var individualRequest = new Request((uint)request.MaleAmount, (uint)request.FemaleAmount, request.DateOfEntrance, request.DateOfExit);
            individual.AddRequest(individualRequest);
            return individualRequest;
        }
        #endregion
    }
}
