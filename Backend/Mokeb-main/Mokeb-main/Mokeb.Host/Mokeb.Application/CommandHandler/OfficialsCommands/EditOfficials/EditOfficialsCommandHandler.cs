using MediatR;
using Mokeb.Application.Contracts;
using Mokeb.Application.Exceptions;
using Mokeb.Common.Base.ApplicationExceptions;
using Mokeb.Domain.Model.Entities;
using ResponseModel = Mokeb.Application.CommandHandler.OfficialsCommands.EditOfficials.EditOfficialsCommandResponse;
namespace Mokeb.Application.CommandHandler.OfficialsCommands.EditOfficials
{
    public class EditOfficialsCommandHandler : IRequestHandler<EditOfficialsCommand, EditOfficialsCommandResponse>
    {
        private readonly IOfficialsRepository _officialsRepository;
        private readonly IUnitOfWork _unitOfWork;

        public EditOfficialsCommandHandler(IOfficialsRepository officialsRepository, IUnitOfWork unitOfWork)
        {
            _officialsRepository = officialsRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<EditOfficialsCommandResponse> Handle(EditOfficialsCommand request, CancellationToken cancellationToken)
        {
            var official = await GetOfficial(request.Id, cancellationToken);
            UpdateOfficial(official, request.Name, request.LastName, request.PhoneNumber);
            var savingResult = await _unitOfWork.Commit(cancellationToken);
            savingResult.ThrowIfNoChanges<NoChangesApplicationException>();
            return ResponseModel
                .Response()
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
        private void UpdateOfficial(Officials official, string name, string familyName, string phoneNumber)
        {
            official.ChangeName(name);
            official.ChangeFamilyName(familyName);
            official.ChangePhoneNumber(phoneNumber);
        }
        #endregion
    }
}
