using MediatR;
using Mokeb.Application.Contracts;
using Mokeb.Application.Exceptions;
using Mokeb.Common.Base.ApplicationExceptions;
using Mokeb.Domain.Model.Entities;
using ResponseModel = Mokeb.Application.CommandHandler.AdminCommands.DeleteCaravan.DeleteCaravanCommandResponse;

namespace Mokeb.Application.CommandHandler.AdminCommands.DeleteCaravan
{
    public class DeleteCaravanCommandHandler : IRequestHandler<DeleteCaravanCommand, DeleteCaravanCommandResponse>
    {
        private readonly ICaravanPrincipalRepository _caravanPrincipalRepository;
        private readonly IUnitOfWork _unitOfWork;

        public DeleteCaravanCommandHandler(ICaravanPrincipalRepository caravanPrincipalRepository, IUnitOfWork unitOfWork)
        {
            _caravanPrincipalRepository = caravanPrincipalRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<DeleteCaravanCommandResponse> Handle(DeleteCaravanCommand command, CancellationToken ct)
        {
            var caravanPrincipal = await GetCaravan(command.CaravanId, ct);
            _caravanPrincipalRepository.RemoveCaravan(caravanPrincipal);
            var savingResult = await _unitOfWork.Commit(ct);
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
        #endregion
    }
}
