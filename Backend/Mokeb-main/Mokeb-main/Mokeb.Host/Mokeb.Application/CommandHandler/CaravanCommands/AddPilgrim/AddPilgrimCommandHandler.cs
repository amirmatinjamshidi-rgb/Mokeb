using MediatR;
using Mokeb.Application.Contracts;
using Mokeb.Application.Exceptions;
using Mokeb.Common.Base.ApplicationExceptions;
using Mokeb.Domain.Model.Entities;
using ResponseModel = Mokeb.Application.CommandHandler.CaravanCommands.AddPilgrim.AddPilgrimCommandResponse;
namespace Mokeb.Application.CommandHandler.CaravanCommands.AddPilgrim
{
    public class AddPilgrimCommandHandler : IRequestHandler<AddPilgrimCommand, AddPilgrimCommandResponse>
    {
        private readonly ICaravanPrincipalRepository _caravanPrincipalRepository;
        private readonly IUnitOfWork _unitOfWork;

        public AddPilgrimCommandHandler(ICaravanPrincipalRepository caravanPrincipalRepository, IUnitOfWork unitOfWork)
        {
            _caravanPrincipalRepository = caravanPrincipalRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<AddPilgrimCommandResponse> Handle(AddPilgrimCommand request, CancellationToken cancellationToken)
        {
            var caravan = await GetCaravan(request.CaravanId, cancellationToken);
            CheckPilgrimExistance(caravan, request.NationalCode);
            caravan.AddPilgrim(request.ToPilgrim());

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
        private void CheckPilgrimExistance(CaravanPrincipal principal, string nationalCode)
        {
            if (principal.Pilgrims.Any(x => x.NationalCode == nationalCode))
                throw new PilgrimExistException();
        }
        #endregion
    }
    public static class PilgrimMapper
    {
        public static Pilgrim ToPilgrim(this AddPilgrimCommand command) => new Pilgrim(command.Name, command.FamilyName, command.NationalCode
                                                , command.DateOfBirth, command.PhoneNumber, command.Gender, command.PassportNumber, command.EmergencyPhoneNumber);
    }
}
