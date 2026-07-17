using MediatR;
using Mokeb.Application.CommandHandler.Base.Extension;
using Mokeb.Application.CommandHandler.IndividualCommands.ReserveRoom;
using Mokeb.Application.Contracts;
using Mokeb.Application.Dtos;
using Mokeb.Application.Exceptions;
using Mokeb.Application.Services;
using Mokeb.Common.Base.ApplicationExceptions;
using Mokeb.Domain.Model.Entities;
using Mokeb.Domain.Model.Enums;
using ResponseModel = Mokeb.Application.CommandHandler.CaravanCommands.AddTravelersToRequestByExcel.AddTravelersToRequestByExcelCommandResponse;
namespace Mokeb.Application.CommandHandler.CaravanCommands.AddTravelersToRequestByExcel
{
    public class AddTravelersToRequestByExcelCommandHandler : IRequestHandler<AddTravelersToRequestByExcelCommand, AddTravelersToRequestByExcelCommandResponse>
    {
        private readonly ICaravanPrincipalRepository _caravanPrincipalRepository;
        private readonly IUnitOfWork _unitOfWork;

        public AddTravelersToRequestByExcelCommandHandler(ICaravanPrincipalRepository caravanPrincipalRepository, IUnitOfWork unitOfWork)
        {
            _caravanPrincipalRepository = caravanPrincipalRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<AddTravelersToRequestByExcelCommandResponse> Handle(AddTravelersToRequestByExcelCommand command, CancellationToken cancellationToken)
        {
            var caravan = await GetCaravan(command.CaravanId, cancellationToken);
            var request = GetRequest(command.RequestId, caravan);
            CheckRequestState(request);
            var pilgrims = await ExcelService.GenereateObjectFromExcelAsync<Pilgrim, ExcelCompanionAndPilgrimDto>(command.ExcelFile, (dto) => new Pilgrim
                (
                    dto.Name,
                    dto.FamilyName,
                    dto.NationalCode,
                    dto.DateOfBirth.ToGregorianDateOnly(),
                    dto.PhoneNumber,
                    dto.Gender == "اقا" || dto.Gender == "آقا" ? Gender.Male : Gender.Female,
                    dto.PassportNumber,
                    dto.EmergencyPhoneNumber
                ),
                cancellationToken);
            AddTravelersToRequestAndPrincipal(pilgrims, caravan, request);
            CheckTravelersAmount(request.Travelers.ToList(), request.MaleCount + request.FemaleCount);

            var savingResult = await _unitOfWork.Commit(cancellationToken);
            savingResult.ThrowIfNoChanges<NoChangesApplicationException>();

            return ResponseModel
                .Response()
                .WithResult(true);

        }
        #region Private Methods
        private async Task<CaravanPrincipal> GetCaravan(Guid caravanId, CancellationToken ct)
        {
            var caravan = await _caravanPrincipalRepository.GetCaravanByIdAsync(caravanId, ct);
            if (caravan is null)
                throw new PrincipalNotFoundApplicationException();
            return caravan;
        }
        private Request GetRequest(Guid requestId, CaravanPrincipal principal)
        {
            var request = principal.Requests.SingleOrDefault(x => x.Id == requestId);
            if (request is null)
                throw new RequestNotFoundException();
            return request;
        }
        private void CheckRequestState(Request request)
        {
            if (request.State != State.Accepted)
                throw new YouAreNotAllowedException();
        }
        private void AddTravelersToRequestAndPrincipal(List<Pilgrim> pilgrims, CaravanPrincipal principal, Request request)
        {
            if (!request.Travelers.Any(x => x.NationalCode == principal.NationalCode))
                request.AddTravelers(principal.ToTravelers());
            foreach (var pilgrim in pilgrims)
            {
                request.AddTravelers(pilgrim.ToTravelers());
                if (principal.Pilgrims.Any(x => x.NationalCode == pilgrim.NationalCode))
                    continue;
                principal.AddPilgrim(pilgrim);
            }
        }
        private void CheckTravelersAmount(List<Travelers> travelers, uint travelersAmount)
        {
            if (travelers.Count > travelersAmount)
                throw new TravelersInformationIsMoreThanAmountException();
        }
        #endregion
    }
}
