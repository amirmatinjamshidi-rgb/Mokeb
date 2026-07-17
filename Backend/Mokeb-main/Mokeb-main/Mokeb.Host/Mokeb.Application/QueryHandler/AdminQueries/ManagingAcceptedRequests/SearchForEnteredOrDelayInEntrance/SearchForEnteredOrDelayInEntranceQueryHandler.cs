using MediatR;
using Mokeb.Application.Contracts;
using ResponseModel = Mokeb.Application.QueryHandler.AdminQueries.ManagingAcceptedRequests.SearchForEnteredOrDelayInEntrance.SearchForEnteredOrDelayInEntranceQueryResponse;
namespace Mokeb.Application.QueryHandler.AdminQueries.ManagingAcceptedRequests.SearchForEnteredOrDelayInEntrance
{
    public class SearchForEnteredOrDelayInEntranceQueryHandler : IRequestHandler<SearchForEnteredOrDelayInEntranceQuery, SearchForEnteredOrDelayInEntranceQueryResponse>
    {
        private readonly ICaravanPrincipalRepository _caravanPrincipalRepository;
        private readonly IIndividualRepository _individualPrincipalRepository;

        public SearchForEnteredOrDelayInEntranceQueryHandler(ICaravanPrincipalRepository caravanPrincipalRepository, IIndividualRepository individualPrincipalRepository)
        {
            _caravanPrincipalRepository = caravanPrincipalRepository;
            _individualPrincipalRepository = individualPrincipalRepository;
        }

        public async Task<SearchForEnteredOrDelayInEntranceQueryResponse> Handle(SearchForEnteredOrDelayInEntranceQuery request, CancellationToken cancellationToken)
        {
            var caravanRequests = await _caravanPrincipalRepository.SearchInEnteredOrDelayInEnterRequestWithNameOrFamilyName(request.Date, request.Input, cancellationToken);
            var individualRequests = await _individualPrincipalRepository.SearchInEnteredOrDelayInEnterRequestWithNameOrFamilyName(request.Date, request.Input, cancellationToken);
            var requests = caravanRequests.Concat(individualRequests).ToList();
            return ResponseModel
                .SucceededResponse(requests.ToGettingAcceptedRequestResponseDto());
        }
    }
}
