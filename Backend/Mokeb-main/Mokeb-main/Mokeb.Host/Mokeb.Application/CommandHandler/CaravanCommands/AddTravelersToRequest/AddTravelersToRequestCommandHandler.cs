using MediatR;
using Mokeb.Application.CommandHandler.IndividualCommands.ReserveRoom;
using Mokeb.Application.Contracts;
using Mokeb.Application.Dtos;
using Mokeb.Application.Exceptions;
using Mokeb.Common.Base.ApplicationExceptions;
using Mokeb.Domain.Model.Entities;
using Mokeb.Domain.Model.Enums;
using ResponseModel = Mokeb.Application.CommandHandler.CaravanCommands.AddTravelersToRequest.AddTravelersToRequestCommandResponse;
namespace Mokeb.Application.CommandHandler.CaravanCommands.AddTravelersToRequest
{
    public class AddTravelersToRequestCommandHandler : IRequestHandler<AddTravelersToRequestCommand, AddTravelersToRequestCommandResponse>
    {
        private readonly ICaravanPrincipalRepository _caravanPrincipalRepository;
        private readonly IUnitOfWork _unitOfWork;

        public AddTravelersToRequestCommandHandler(ICaravanPrincipalRepository caravanPrincipalRepository, IUnitOfWork unitOfWork)
        {
            _caravanPrincipalRepository = caravanPrincipalRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<AddTravelersToRequestCommandResponse> Handle(AddTravelersToRequestCommand command, CancellationToken ct)
        {
            var caravan = await GetCaravan(command.CaravanId, ct);
            var request = GetRequest(command.RequestId, caravan);
            CheckRequestState(request);
            AddTravelersToRequestAndPrincipal(command.Travelers, caravan, request);
            CheckTravelersAmount(request.Travelers.ToList(), request.FemaleCount + request.MaleCount);

            var savingResult = await _unitOfWork.Commit(ct);
            savingResult.ThrowIfNoChanges<NoChangesApplicationException>();

            return ResponseModel
                .Response()
                .WithResult(true);
        }
        #region Private Methods
        private async Task<CaravanPrincipal> GetCaravan(Guid caravanId, CancellationToken ct)
        {
            var carvanPrincipal = await _caravanPrincipalRepository.GetCaravanByIdAsync(caravanId, ct);
            if (carvanPrincipal is null)
                throw new PrincipalNotFoundApplicationException();
            return carvanPrincipal;
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
        private void AddTravelersToRequestAndPrincipal(List<TravelerDto> travelers, CaravanPrincipal principal, Request request)
        {
            if (!request.Travelers.Any(x => x.NationalCode == principal.NationalCode))
                request.AddTravelers(principal.ToTravelers());
            foreach (var traveler in travelers)
            {
                request.AddTravelers(traveler.ToTravelers());
                if (principal.Pilgrims.Any(x => x.NationalCode == traveler.NationalCode))
                    continue;
                principal.AddPilgrim(traveler.ToPilgrim());
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
