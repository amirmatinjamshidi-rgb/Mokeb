using MediatR;
using Mokeb.Application.Contracts;
using ResponseModel = Mokeb.Application.QueryHandler.AdminQueries.ManagingAcceptedRequests.SearchForExitedOrDelayInExited.SearchForExitedOrDelayInExitedQueryResponse;
namespace Mokeb.Application.QueryHandler.AdminQueries.ManagingAcceptedRequests.SearchForExitedOrDelayInExited
{
    public class SearchForExitedOrDelayInExitedQueryHandler : IRequestHandler<SearchForExitedOrDelayInExitedQuery, SearchForExitedOrDelayInExitedQueryResponse>
    {
        private readonly ICaravanPrincipalRepository _caravanPrincipalRepository;
        private readonly IIndividualRepository _individualRepository;

        public SearchForExitedOrDelayInExitedQueryHandler(ICaravanPrincipalRepository caravanPrincipalRepository, IIndividualRepository individualRepository)
        {
            _caravanPrincipalRepository = caravanPrincipalRepository;
            _individualRepository = individualRepository;
        }

        public async Task<SearchForExitedOrDelayInExitedQueryResponse> Handle(SearchForExitedOrDelayInExitedQuery request, CancellationToken cancellationToken)
        {
            var caravanRequests = await _caravanPrincipalRepository.SearchInExitedOrDelayInExitRequestWithNameOrFamilyName(request.Date, request.Input, cancellationToken);
            var individualRequests = await _individualRepository.SearchInExitedOrDelayInExitRequestWithNameOrFamilyName(request.Date, request.Input, cancellationToken);
            var requests = caravanRequests.Concat(individualRequests).ToList();
            return ResponseModel
                .SucceededResponse(requests.ToGettingOutGoingOrAcceptedRequestResponseDto());
        }
    }
}
