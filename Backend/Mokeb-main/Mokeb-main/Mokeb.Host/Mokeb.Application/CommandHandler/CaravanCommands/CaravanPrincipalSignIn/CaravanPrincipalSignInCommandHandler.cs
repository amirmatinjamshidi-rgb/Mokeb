using MediatR;
using Mokeb.Application.Contracts;
using Mokeb.Application.Exceptions;
using Mokeb.Common.Base.ApplicationExceptions;

namespace Mokeb.Application.CommandHandler.CaravanCommands.CaravanPrincipalSignIn
{
    public class CaravanPrincipalSignInCommandHandler : IRequestHandler<CaravanPrincipalSignInCommand, CaravanPrincipalSignInCommandResponse>
    {
        private readonly ICaravanPrincipalRepository _caravanRepository;
        private readonly IUnitOfWork _unitOfWork;

        public CaravanPrincipalSignInCommandHandler(ICaravanPrincipalRepository caravanRepository, IUnitOfWork unitOfWork)
        {
            _caravanRepository = caravanRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<CaravanPrincipalSignInCommandResponse> Handle(CaravanPrincipalSignInCommand request, CancellationToken cancellationToken)
        {
            await CheckCaravanExistance(request.Username, request.NationalCode, request.PassportNumber, cancellationToken);
            _caravanRepository.AddCaravan(request.ToIndividualPrincipal());

            var savingResult = await _unitOfWork.Commit(cancellationToken);
            savingResult.ThrowIfNoChanges<NoChangesApplicationException>();

            return CaravanPrincipalSignInCommandResponse.Succeeded;
        }
        #region Private Methods
        private async Task CheckCaravanExistance(string username, string nationalCode, string passportNumber, CancellationToken ct)
        {
            var result = await _caravanRepository.IsCaravanByIdenticalInformationExistsAsync(username, nationalCode, passportNumber, ct);
            if (result)
                throw new CarvanExistException();
        }
        #endregion
    }
}
