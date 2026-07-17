using MediatR;
using Mokeb.Application.Contracts;
using Mokeb.Application.Exceptions;
using Mokeb.Common.Base.ApplicationExceptions;
using Mokeb.Domain.Model.Entities;
using ResponseModel = Mokeb.Application.CommandHandler.IndividualCommands.RemoveCompanion.RemoveCompanionCommandResponse;
namespace Mokeb.Application.CommandHandler.IndividualCommands.RemoveCompanion
{
    public class RemoveCompanionCommandHandler : IRequestHandler<RemoveCompanionCommand, RemoveCompanionCommandResponse>
    {
        private readonly IIndividualRepository _individualRepository;
        private readonly IUnitOfWork _unitOfWork;

        public RemoveCompanionCommandHandler(IIndividualRepository individualRepository, IUnitOfWork unitOfWork)
        {
            _individualRepository = individualRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<RemoveCompanionCommandResponse> Handle(RemoveCompanionCommand request, CancellationToken cancellationToken)
        {
            var individual = await GetIndividual(request.IndividualId, cancellationToken);
            var companion = GetCompanion(request.CompanionId, individual);
            individual.RemoveCompanion(companion);
            var savingResult = await _unitOfWork.Commit(cancellationToken);
            savingResult.ThrowIfNoChanges<NoChangesApplicationException>();
            return ResponseModel
                .Response()
                .WithResult(true);
        }
        #region Private Methods
        private async Task<IndividualPrincipal> GetIndividual(Guid individualId, CancellationToken ct)
        {
            var individual = await _individualRepository.GetIndividualByIdAsync(individualId, ct);
            if (individual is null)
                throw new PrincipalNotFoundApplicationException();
            return individual;
        }
        private Companion GetCompanion(Guid companionId, IndividualPrincipal individual)
        {
            var companion = individual.Companion.SingleOrDefault(x => x.Id == companionId);
            if (companion is null)
                throw new CompanionNotFoundException();
            return companion;
        }
        #endregion
    }
}
