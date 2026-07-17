using MediatR;
using Mokeb.Application.Contracts;
using Mokeb.Application.Exceptions;
using Mokeb.Common.Base.ApplicationExceptions;
using Mokeb.Common.Base.Helper;
using Mokeb.Domain.Model.Base;
using ResponseModel = Mokeb.Application.CommandHandler.PrincipalsChangePassword.PrincipalsChangePasswordCommandResponse;
namespace Mokeb.Application.CommandHandler.PrincipalsChangePassword
{
    public class PrincipalsChangePasswordCommandHandler : IRequestHandler<PrincipalsChangePasswordCommand, PrincipalsChangePasswordCommandResponse>
    {
        private readonly ICaravanPrincipalRepository _caravanPrincipalRepository;
        private readonly IIndividualRepository _individualRepository;
        private readonly IUnitOfWork _unitOfWork;

        public PrincipalsChangePasswordCommandHandler(ICaravanPrincipalRepository caravanPrincipalRepository,
            IIndividualRepository individualRepository, IUnitOfWork unitOfWork)
        {
            _caravanPrincipalRepository = caravanPrincipalRepository;
            _individualRepository = individualRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<PrincipalsChangePasswordCommandResponse> Handle(PrincipalsChangePasswordCommand request, CancellationToken cancellationToken)
        {
            var principal = await GetPrincipal(request.Id, cancellationToken);
            CheckPrincipalPassword(request.CurrentPassword, principal);
            principal.IdentityInformation.ChangePassword(request.NewPassword);

            var savingResult = await _unitOfWork.Commit(cancellationToken);
            savingResult.ThrowIfNoChanges<NoChangesApplicationException>();

            return ResponseModel
                .Response()
                .WithResult(true);
        }
        #region Private Methods
        private async Task<Principal> GetPrincipal(Guid id, CancellationToken ct)
        {
            var caravan = await _caravanPrincipalRepository.GetCaravanByIdAsync(id, ct);
            if (caravan is null)
            {
                var individual = await _individualRepository.GetIndividualByIdAsync(id, ct);
                if (individual is null)
                    throw new PrincipalNotFoundApplicationException();
                return individual;
            }
            return caravan;
        }
        private void CheckPrincipalPassword(string oldPassword, Principal principal)
        {
            if (!string.Equals(principal.IdentityInformation.Password, Hasher.HashData(oldPassword)))
                throw new PasswordIsInvalidException();
        }
        #endregion
    }
}
