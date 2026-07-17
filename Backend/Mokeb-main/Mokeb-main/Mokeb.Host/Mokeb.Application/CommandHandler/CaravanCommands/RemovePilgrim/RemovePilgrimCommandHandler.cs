using MediatR;
using Mokeb.Application.Contracts;
using Mokeb.Application.Exceptions;
using Mokeb.Common.Base.ApplicationExceptions;
using Mokeb.Domain.Model.Entities;
using ResponseModel = Mokeb.Application.CommandHandler.CaravanCommands.RemovePilgrim.RemovePilgrimCommandResponse;
namespace Mokeb.Application.CommandHandler.CaravanCommands.RemovePilgrim
{
    public class RemovePilgrimCommandHandler : IRequestHandler<RemovePilgrimCommand, RemovePilgrimCommandResponse>
    {
        private readonly ICaravanPrincipalRepository _caravanPrincipalRepository;
        private readonly IUnitOfWork _unitOfWork;

        public RemovePilgrimCommandHandler(ICaravanPrincipalRepository caravanPrincipalRepository, IUnitOfWork unitOfWork)
        {
            _caravanPrincipalRepository = caravanPrincipalRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<RemovePilgrimCommandResponse> Handle(RemovePilgrimCommand request, CancellationToken cancellationToken)
        {
            var caravan = await GetCaravan(request.CaravanId, cancellationToken);
            RemovePilgrim(caravan, request.NationalCode);

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
        private void RemovePilgrim(CaravanPrincipal principal, string nationalCode)
        {
            var pilgrim = principal.Pilgrims.SingleOrDefault(x => x.NationalCode == nationalCode);
            if (pilgrim is null)
                throw new PilgrimNotFouncException();
            principal.RemovePilgrim(pilgrim);
        }
        #endregion
    }
}
