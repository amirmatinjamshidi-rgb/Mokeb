using MediatR;
using Mokeb.Application.Contracts;
using ResponseModel = Mokeb.Application.QueryHandler.AdminQueries.ManagingFAQs.GetAllFAQs.GetAllFAQsQueryResponse;
namespace Mokeb.Application.QueryHandler.AdminQueries.ManagingFAQs.GetAllFAQs
{
    public class GetAllFAQsQueryHandler : IRequestHandler<GetAllFAQsQuery, GetAllFAQsQueryResponse>
    {
        private readonly IFAQRepository _faqRepository;
        private readonly IUnitOfWork _unitOfWork;

        public GetAllFAQsQueryHandler(IFAQRepository faqRepository, IUnitOfWork unitOfWork)
        {
            _faqRepository = faqRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<GetAllFAQsQueryResponse> Handle(GetAllFAQsQuery request, CancellationToken cancellationToken)
        {
            var listOfFaq = await _faqRepository.GetAllFAQsAsync(cancellationToken);
            return ResponseModel
                .Response()
                .WithFaqs(listOfFaq);
        }
    }
}
