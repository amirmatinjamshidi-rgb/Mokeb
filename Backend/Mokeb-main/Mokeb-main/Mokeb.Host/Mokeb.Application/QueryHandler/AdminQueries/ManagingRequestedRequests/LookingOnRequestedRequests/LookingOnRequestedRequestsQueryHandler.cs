using MediatR;
using Mokeb.Application.Contracts;
using ResponseModel = Mokeb.Application.QueryHandler.AdminQueries.ManagingRequestedRequests.LookingOnRequestedRequests.LookingOnRequestedRequestsQueryResponse;
namespace Mokeb.Application.QueryHandler.AdminQueries.ManagingRequestedRequests.LookingOnRequestedRequests
{
    public class LookingOnRequestedRequestsQueryHandler : IRequestHandler<LookingOnRequestedRequestsQuery, LookingOnRequestedRequestsQueryResponse>
    {
        private readonly ICaravanPrincipalRepository _caravanPrincipalRepository;

        public LookingOnRequestedRequestsQueryHandler(ICaravanPrincipalRepository caravanPrincipalRepository)
        {
            _caravanPrincipalRepository = caravanPrincipalRepository;
        }

        public async Task<LookingOnRequestedRequestsQueryResponse> Handle(LookingOnRequestedRequestsQuery query, CancellationToken ct)
        {
            var requestsList = await _caravanPrincipalRepository.GetRequestedRequestsByDateAsync(query.EntranceDate, ct);
            return ResponseModel.SucceededResponse()
                .WithRequests(requestsList.ToRequestedRequestsDto());
        }
    }
}
