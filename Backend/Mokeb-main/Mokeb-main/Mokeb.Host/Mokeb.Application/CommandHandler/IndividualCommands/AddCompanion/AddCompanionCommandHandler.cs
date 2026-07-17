using MediatR;
using Mokeb.Application.Contracts;
using Mokeb.Application.Exceptions;
using Mokeb.Common.Base.ApplicationExceptions;
using Mokeb.Domain.Model.Entities;
using ResponseModel = Mokeb.Application.CommandHandler.IndividualCommands.AddCompanion.AddCompanionCommandResponse;
namespace Mokeb.Application.CommandHandler.IndividualCommands.AddCompanion
{
    public class AddCompanionCommandHandler : IRequestHandler<AddCompanionCommand, AddCompanionCommandResponse>
    {
        private readonly IIndividualRepository _individualRepository;
        private readonly IUnitOfWork _unitOfWork;

        public AddCompanionCommandHandler(IIndividualRepository individualRepository, IUnitOfWork unitOfWork)
        {
            _individualRepository = individualRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<AddCompanionCommandResponse> Handle(AddCompanionCommand request, CancellationToken cancellationToken)
        {
            var individual = await GetIndividual(request.IndividualId, cancellationToken);
            CheckCompanionExistance(request, individual);
            individual.AddCompanion(request.ToCompanion(individual.Id));
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
        private void CheckCompanionExistance(AddCompanionCommand request, IndividualPrincipal individual)
        {
            if (individual.Companion.Any(x => x.NationalCode == request.NationalCode))
                throw new CompanionExistException();
        }
        #endregion
    }
}
