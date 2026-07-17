using MediatR;
using Mokeb.Application.Contracts;
using Mokeb.Application.Exceptions;
using Mokeb.Common.Base.ApplicationExceptions;
using Mokeb.Domain.Model.Base;
using ResponseModel = Mokeb.Application.CommandHandler.AdminCommands.ActivingPrincipal.ActivingOrDeActivingPrincipalCommandResponse;

namespace Mokeb.Application.CommandHandler.AdminCommands.ActivingPrincipal
{
    public class ActivingOrDeActivingPrincipalCommandHandler : IRequestHandler<ActivingOrDeActivingPrincipalCommand, ActivingOrDeActivingPrincipalCommandResponse>
    {
        private readonly ICaravanPrincipalRepository _caravanPrincipalRepository;
        private readonly IIndividualRepository _individualPrincipalRepository;
        private readonly IUnitOfWork _unitOfWork;

        public ActivingOrDeActivingPrincipalCommandHandler(ICaravanPrincipalRepository caravanPrincipalRepository,
            IIndividualRepository individualPrincipalRepository, IUnitOfWork unitOfWork)
        {
            _caravanPrincipalRepository = caravanPrincipalRepository;
            _individualPrincipalRepository = individualPrincipalRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<ActivingOrDeActivingPrincipalCommandResponse> Handle(ActivingOrDeActivingPrincipalCommand request, CancellationToken cancellationToken)
        {
            var principal = await GetPrincipal(request.PrincipalId, cancellationToken);
            ChangeIsActiveStatus(principal, request.ActiveOrDeactive);
            var savingResult = await _unitOfWork.Commit(cancellationToken);
            savingResult.ThrowIfNoChanges<NoChangesApplicationException>();

            return ResponseModel
                .Response()
                .WithResult(true);

        }
        #region Private Methods
        private async Task<Principal> GetPrincipal(Guid Id, CancellationToken ct)
        {
            var caravan = await _caravanPrincipalRepository.GetCaravanByIdAsync(Id, ct);
            if (caravan == null)
            {
                var individual = await _individualPrincipalRepository.GetIndividualByIdAsync(Id, ct);
                if (individual != null)
                    return individual;
                else
                    throw new PrincipalNotFoundApplicationException();
            }
            return caravan;
        }
        private void ChangeIsActiveStatus(Principal principal, bool isActive)
        {
            if (!isActive)
                principal.Deactive();
            else
                principal.Active();
        }
        #endregion
    }
}
