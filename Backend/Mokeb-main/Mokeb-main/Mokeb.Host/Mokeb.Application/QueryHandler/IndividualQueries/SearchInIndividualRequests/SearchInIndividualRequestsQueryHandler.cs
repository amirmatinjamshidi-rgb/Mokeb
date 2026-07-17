using MediatR;
using Mokeb.Application.Contracts;
using Mokeb.Application.QueryHandler.AdminQueries;
using ResponseModel = Mokeb.Application.QueryHandler.IndividualQueries.SearchInIndividualRequests.SearchInIndividualRequestsQueryResponse;
namespace Mokeb.Application.QueryHandler.IndividualQueries.SearchInIndividualRequests
{
    public class SearchInIndividualRequestsQueryHandler : IRequestHandler<SearchInIndividualRequestsQuery, SearchInIndividualRequestsQueryResponse>
    {
        private readonly IIndividualRepository _individualRepository;

        public SearchInIndividualRequestsQueryHandler(IIndividualRepository individualRepository)
        {
            _individualRepository = individualRepository;
        }

        public async Task<SearchInIndividualRequestsQueryResponse> Handle(SearchInIndividualRequestsQuery request, CancellationToken cancellationToken)
        {
            var requests = await _individualRepository.SearchInRequestAsync(request.IndividualId, request.Date, cancellationToken);
            return ResponseModel
                .Response()
                .WithRequests(requests.ToRequestDto());
        }
    }
}
