using MediatR;
using Mokeb.Application.Contracts;
using Mokeb.Application.Exceptions;
using Mokeb.Common.Base.ApplicationExceptions;
using ResponseModel = Mokeb.Application.CommandHandler.OfficialsCommands.AddOfficials.AddOfficialsCommandResponse;
namespace Mokeb.Application.CommandHandler.OfficialsCommands.AddOfficials
{
    public class AddOfficialsCommandHandler : IRequestHandler<AddOfficialsCommand, AddOfficialsCommandResponse>
    {
        private readonly IOfficialsRepository _officialsRepository;
        private readonly IUnitOfWork _unitOfWork;

        public AddOfficialsCommandHandler(IOfficialsRepository officialsRepository, IUnitOfWork unitOfWork)
        {
            _officialsRepository = officialsRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<AddOfficialsCommandResponse> Handle(AddOfficialsCommand request, CancellationToken cancellationToken)
        {
            await CheckOffiacialExistance(request.Name, request.LastName, request.PhoneNumber, cancellationToken);
            _officialsRepository.AddOfficials(request.ToOfficials());
            var savingResult = await _unitOfWork.Commit(cancellationToken);
            savingResult.ThrowIfNoChanges<NoChangesApplicationException>();
            return ResponseModel
                .Succeeded()
                .WithResult(true);

        }
        #region Private Methods
        private async Task CheckOffiacialExistance(string name, string familyName, string phoneNumber, CancellationToken ct)
        {
            var result = await _officialsRepository.CheckOfficialsExistanceByInformationAsync(name, familyName, phoneNumber, ct);
            if (result)
                throw new OfficialExistException();
        }
        #endregion
    }
}
