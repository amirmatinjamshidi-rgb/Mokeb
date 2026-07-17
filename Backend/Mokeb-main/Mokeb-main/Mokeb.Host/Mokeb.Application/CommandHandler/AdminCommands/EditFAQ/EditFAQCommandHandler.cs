using MediatR;
using Mokeb.Application.Contracts;
using Mokeb.Application.Exceptions;
using Mokeb.Common.Base.ApplicationExceptions;
using Mokeb.Domain.Model.Entities;
using ResponseModel = Mokeb.Application.CommandHandler.AdminCommands.EditFAQ.EditFAQCommandResponse;

namespace Mokeb.Application.CommandHandler.AdminCommands.EditFAQ
{
    public class EditFAQCommandHandler : IRequestHandler<EditFAQCommand, EditFAQCommandResponse>
    {
        private readonly IFAQRepository _faqRepository;
        private readonly IUnitOfWork _unitOfWork;

        public EditFAQCommandHandler(IFAQRepository faqRepository, IUnitOfWork unitOfWork)
        {
            _faqRepository = faqRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<EditFAQCommandResponse> Handle(EditFAQCommand request, CancellationToken cancellationToken)
        {
            var faq = await GetFAQ(request.FaqId, cancellationToken);
            ChangeFAQInformation(faq, request.Question, request.Answer);
            var savingResult = await _unitOfWork.Commit(cancellationToken);
            savingResult.ThrowIfNoChanges<NoChangesApplicationException>();

            return ResponseModel
                .Response()
                .WithResult(true);
        }
        #region Private Methods
        private async Task<FAQ> GetFAQ(Guid faqId, CancellationToken ct)
        {
            var faq = await _faqRepository.GetFAQAsync(faqId, ct);
            if (faq is null)
                throw new FAQNotFoundException();
            return faq;
        }
        private void ChangeFAQInformation(FAQ faq, string question, string answer)
        {
            faq.ChangeAnswer(answer);
            faq.ChangeQuestion(question);
        }
        #endregion
    }
}
