using MediatR;
using Mokeb.Application.Contracts;
using Mokeb.Application.Exceptions;
using Mokeb.Common.Base.ApplicationExceptions;
using Mokeb.Domain.Model.Entities;
using ResponseModel = Mokeb.Application.CommandHandler.CaravanCommands.CaravanSendsRequest.CaravanSendsRequestCommandResponse;
namespace Mokeb.Application.CommandHandler.CaravanCommands.CaravanSendsRequest
{
    public class CaravanSendsRequestCommandHandler : IRequestHandler<CaravanSendsRequestCommand, CaravanSendsRequestCommandResponse>
    {
        private readonly ICaravanPrincipalRepository _caravanPrincipalRepository;
        private readonly IUnitOfWork _unitOfWork;

        public CaravanSendsRequestCommandHandler(ICaravanPrincipalRepository caravanPrincipalRepository, IUnitOfWork unitOfWork)
        {
            _caravanPrincipalRepository = caravanPrincipalRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<CaravanSendsRequestCommandResponse> Handle(CaravanSendsRequestCommand request, CancellationToken cancellationToken)
        {
            var caravan = await GetCaravan(request.CaravanId, cancellationToken);
            caravan.AddRequest(request.ToRequest());
            var savingResult = await _unitOfWork.Commit(cancellationToken);
            savingResult.ThrowIfNoChanges<NoChangesApplicationException>();
            return ResponseModel
                .Response()
                .WithResult(true);
        }
        #region Private Methods
        private async Task<CaravanPrincipal> GetCaravan(Guid caravanId, CancellationToken ct)
        {
            var carvanPrincipal = await _caravanPrincipalRepository.GetCaravanByIdAsync(caravanId, ct);
            if (carvanPrincipal is null)
                throw new PrincipalNotFoundApplicationException();
            return carvanPrincipal;
        }
        #endregion
    }
    public static class RequestMapper
    {
        public static Request ToRequest(this CaravanSendsRequestCommand command) => new Request((uint)command.MaleAmount, (uint)command.FemaleAmount, command.EnterTime, command.ExitTime);
    }
}
