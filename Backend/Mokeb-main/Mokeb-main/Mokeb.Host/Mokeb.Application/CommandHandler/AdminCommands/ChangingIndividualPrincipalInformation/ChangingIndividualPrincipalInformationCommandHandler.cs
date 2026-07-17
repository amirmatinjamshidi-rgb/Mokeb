using MediatR;
using Mokeb.Application.Contracts;
using Mokeb.Common.Base.ApplicationExceptions;
using Mokeb.Domain.Model.Entities;
using Mokeb.Domain.Model.Enums;
using Mokeb.Domain.Model.Exceptions.IndividualExceptions;
using ResponseModel = Mokeb.Application.CommandHandler.AdminCommands.ChangingIndividualPrincipalInformation.ChangingIndividualPrincipalInformationCommandResponse;

namespace Mokeb.Application.CommandHandler.AdminCommands.ChangingIndividualPrincipalInformation
{
    public class ChangingIndividualPrincipalInformationCommandHandler : IRequestHandler<ChangingIndividualPrincipalInformationCommand, ChangingIndividualPrincipalInformationCommandResponse>
    {
        private readonly IIndividualRepository _individualPrincipalRepository;
        private readonly IUnitOfWork _unitOfWork;

        public ChangingIndividualPrincipalInformationCommandHandler(IIndividualRepository individualPrincipalRepository, IUnitOfWork unitOfWork)
        {
            _individualPrincipalRepository = individualPrincipalRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<ChangingIndividualPrincipalInformationCommandResponse> Handle(ChangingIndividualPrincipalInformationCommand request, CancellationToken cancellationToken)
        {
            var individual = await GetIndividual(request.IndividualId, cancellationToken);
            ChangeIndividualPrincipal(individual, request.Name, request.FamilyName, request.NationalCode, request.DateOfBirth,
                request.Gender, request.PassportNumber, request.Gmail, request.PhoneNumber, request.EmergencyPhoneNumber);

            var savingResult = await _unitOfWork.Commit(cancellationToken);
            savingResult.ThrowIfNoChanges<NoChangesApplicationException>();

            return ResponseModel
                .Response()
                .WithResult(true);
        }
        #region Private Methods
        private async Task<IndividualPrincipal> GetIndividual(Guid individualId, CancellationToken ct)
        {
            var individual = await _individualPrincipalRepository.GetIndividualByIdAsync(individualId, ct);
            if (individual is null)
                throw new IndividualNotFoundException();
            return individual;
        }
        private void ChangeIndividualPrincipal(IndividualPrincipal individualPrincipal, string name, string familyName, string nationalCode
            , DateOnly dateOfBirth, Gender gender, string passportNumber
            , string gmail, string phoneNumber, string emergencyPhoneNumber)
        {
            individualPrincipal.ChangeName(name);
            individualPrincipal.ChangeFamilyName(familyName);
            individualPrincipal.ChangeNationalCode(nationalCode);
            individualPrincipal.ChangeDateOfBirth(dateOfBirth);
            individualPrincipal.ChangeGender(gender);
            individualPrincipal.ChangePassportNumber(passportNumber);
            individualPrincipal.ContactInformation.ChangeGmail(gmail);
            individualPrincipal.ContactInformation.ChangePhoneNumber(phoneNumber);
            individualPrincipal.ContactInformation.ChangeEmergencyPhoneNumber(emergencyPhoneNumber);
        }
        #endregion
    }
}
