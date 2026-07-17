using MediatR;
using Mokeb.Application.Contracts;
using Mokeb.Common.Base.ApplicationExceptions;
using ResponseModel = Mokeb.Application.CommandHandler.AdminCommands.AddFAQ.AddFAQCommandResponse;
namespace Mokeb.Application.CommandHandler.AdminCommands.AddFAQ
{
    public class AddFAQCommandHandler : IRequestHandler<AddFAQCommand, AddFAQCommandResponse>
    {
        private readonly IFAQRepository _faqRepository;
        private readonly IUnitOfWork _unitOfWork;

        public AddFAQCommandHandler(IFAQRepository faqRepository, IUnitOfWork unitOfWork)
        {
            _faqRepository = faqRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<AddFAQCommandResponse> Handle(AddFAQCommand command, CancellationToken ct)
        {
            _faqRepository.AddFaq(command.ToFaq());
            var savingResult = await _unitOfWork.Commit(ct);
            savingResult.ThrowIfNoChanges<NoChangesApplicationException>();
            return ResponseModel
                .Response()
                .WithResult(true);
        }
    }
}
