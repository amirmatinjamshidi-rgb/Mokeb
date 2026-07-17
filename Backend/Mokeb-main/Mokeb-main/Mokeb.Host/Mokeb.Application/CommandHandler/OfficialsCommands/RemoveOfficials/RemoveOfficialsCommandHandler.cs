using MediatR;
using Mokeb.Application.Contracts;
using Mokeb.Application.Exceptions;
using Mokeb.Common.Base.ApplicationExceptions;
using Mokeb.Domain.Model.Entities;
using ResponseModel = Mokeb.Application.CommandHandler.OfficialsCommands.RemoveOfficials.RemoveOfficialsCommandResponse;
namespace Mokeb.Application.CommandHandler.OfficialsCommands.RemoveOfficials
{
    public class RemoveOfficialsCommandHandler : IRequestHandler<RemoveOfficialsCommand, RemoveOfficialsCommandResponse>
    {
        private readonly IOfficialsRepository _officialsRepository;
        private readonly IUnitOfWork _unitOfWork;

        public RemoveOfficialsCommandHandler(IOfficialsRepository officialsRepository, IUnitOfWork unitOfWork)
        {
            _officialsRepository = officialsRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<RemoveOfficialsCommandResponse> Handle(RemoveOfficialsCommand request, CancellationToken cancellationToken)
        {
            var official = await GetOfficial(request.OfficialId, cancellationToken);
            _officialsRepository.RemoveOfficials(official);
            var savingResult = await _unitOfWork.Commit(cancellationToken);
            savingResult.ThrowIfNoChanges<NoChangesApplicationException>();
            return ResponseModel
                .Succeeded()
                .WithResult(true);

        }
        #region Private Methods
        private async Task<Officials> GetOfficial(Guid officialId, CancellationToken ct)
        {
            var official = await _officialsRepository.GetOfficialByIdAsync(officialId, ct);
            if (official is null)
                throw new OfficialNotFoundException();
            return official;
        }
        #endregion
    }
}
