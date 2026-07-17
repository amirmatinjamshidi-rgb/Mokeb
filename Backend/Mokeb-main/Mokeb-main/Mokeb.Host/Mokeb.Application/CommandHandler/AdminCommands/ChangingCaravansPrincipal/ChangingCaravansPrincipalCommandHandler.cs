using MediatR;
using Mokeb.Application.Contracts;
using Mokeb.Application.Exceptions;
using Mokeb.Common.Base.ApplicationExceptions;
using Mokeb.Domain.Model.Entities;
using Mokeb.Domain.Model.Enums;
using ResponseModel = Mokeb.Application.CommandHandler.AdminCommands.ChangingCaravansPrincipal.ChangingCaravansPrincipalCommandResponse;

namespace Mokeb.Application.CommandHandler.AdminCommands.ChangingCaravansPrincipal
{
    public class ChangingCaravansPrincipalCommandHandler : IRequestHandler<ChangingCaravansPrincipalCommand, ChangingCaravansPrincipalCommandResponse>
    {
        private readonly ICaravanPrincipalRepository _caravanPrincipalRepository;
        private readonly IUnitOfWork _unitOfWork;

        public ChangingCaravansPrincipalCommandHandler(ICaravanPrincipalRepository caravanPrincipalRepository, IUnitOfWork unitOfWork)
        {
            _caravanPrincipalRepository = caravanPrincipalRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<ChangingCaravansPrincipalCommandResponse> Handle(ChangingCaravansPrincipalCommand request, CancellationToken cancellationToken)
        {
            var caravan = await GetCaravan(request.CaravanId, cancellationToken);
            ChangeCaravanPrincipal(caravan, request.Name, request.FamilyName, request.NationalCode, request.DateOfBirth,
                request.Gender, request.PassportNumber, request.Gmail, request.PhoneNumber, request.EmergencyPhoneNumber);

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
                throw new CaravanNotFoundExceptiopn();
            return caravan;
        }
        private void ChangeCaravanPrincipal(CaravanPrincipal caravanPrincipal, string name, string familyName, string nationalCode
            , DateOnly dateOfBirth, Gender gender, string passportNumber
            , string gmail, string phoneNumber, string emergencyPhoneNumber)
        {
            caravanPrincipal.ChangeName(name);
            caravanPrincipal.ChangeFamilyName(familyName);
            caravanPrincipal.ChangeNationalCode(nationalCode);
            caravanPrincipal.ChangeDateOfBirth(dateOfBirth);
            caravanPrincipal.ChangeGender(gender);
            caravanPrincipal.ChangePassportNumber(passportNumber);
            caravanPrincipal.ContactInformation.ChangeGmail(gmail);
            caravanPrincipal.ContactInformation.ChangePhoneNumber(phoneNumber);
            caravanPrincipal.ContactInformation.ChangeEmergencyPhoneNumber(emergencyPhoneNumber);
        }
        #endregion
    }
}
