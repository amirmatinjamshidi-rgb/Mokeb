using MediatR;
using Mokeb.Application.Contracts;
using Mokeb.Application.Exceptions;
using Mokeb.Common.Base.ApplicationExceptions;
using Mokeb.Domain.Model.Entities;
using ResponseModel = Mokeb.Application.CommandHandler.AdminCommands.RejectingARequestedRequest.RejectingARequestedRequestCommandResponse;

namespace Mokeb.Application.CommandHandler.AdminCommands.RejectingARequestedRequest
{
    public class RejectingARequestedRequestCommandHandler : IRequestHandler<RejectingARequestedRequestCommand, RejectingARequestedRequestCommandResponse>
    {
        private readonly ICaravanPrincipalRepository _caravanPrincipalRepository;
        private readonly IUnitOfWork _unitOfWork;

        public RejectingARequestedRequestCommandHandler(ICaravanPrincipalRepository caravanPrincipalRepository, IUnitOfWork unitOfWork)
        {
            _caravanPrincipalRepository = caravanPrincipalRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<RejectingARequestedRequestCommandResponse> Handle(RejectingARequestedRequestCommand command, CancellationToken ct)
        {
            var request = await GetRequest(command.RequestId, ct);
            request.ChangeToRejected();
            var savingResult = await _unitOfWork.Commit(ct);
            savingResult.ThrowIfNoChanges<NoChangesApplicationException>();
            return ResponseModel
                .Response()
                .WithResult(true);
        }
        #region Private Methods
        private async Task<Request> GetRequest(Guid requestId, CancellationToken ct)
        {
            var request = await _caravanPrincipalRepository.GetRequestByIdAsync(requestId, ct);
            if (request is null)
                throw new RequestNotFoundException();
            return request;
        }
        #endregion
    }
}
