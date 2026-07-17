using MediatR;
using Mokeb.Application.Contracts;
using Mokeb.Application.Exceptions;
using Mokeb.Common.Base.ApplicationExceptions;
using Mokeb.Domain.Model.Entities;
using ResponseModel = Mokeb.Application.CommandHandler.AdminCommands.DeleteIndividual.DeleteIndividualCommandResponse;
namespace Mokeb.Application.CommandHandler.AdminCommands.DeleteIndividual
{
    public class DeleteIndividualCommandHandler : IRequestHandler<DeleteIndividualCommand, DeleteIndividualCommandResponse>
    {
        private readonly IIndividualRepository _individualRepository;
        private readonly IUnitOfWork _unitOfWork;

        public DeleteIndividualCommandHandler(IIndividualRepository individualRepository, IUnitOfWork unitOfWork)
        {
            _individualRepository = individualRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<DeleteIndividualCommandResponse> Handle(DeleteIndividualCommand request, CancellationToken ct)
        {
            var individualPrincipal = await GetIndividual(request.IndividualId, ct);
            _individualRepository.RemoveIndividual(individualPrincipal);
            var savingResult = await _unitOfWork.Commit(ct);
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
        #endregion
    }
}
