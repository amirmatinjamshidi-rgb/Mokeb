using MediatR;
using Mokeb.Application.Contracts;

namespace Mokeb.Application.QueryHandler.AdminQueries.ManagingAcceptedRequests.GettingIncomingOrAcceptedRequestByDate
{
    public class GettingIncomingOrAcceptedRequestByDateQueryHandler : IRequestHandler<GettingIncomingOrAcceptedRequestByDateQuery, GettingIncomingOrAcceptedRequestByDateQueryResponse>
    {
        private readonly IIndividualRepository _individualRepository;
        private readonly ICaravanPrincipalRepository _caravanPrincipalRepository;

        public GettingIncomingOrAcceptedRequestByDateQueryHandler(IIndividualRepository individualRepository, ICaravanPrincipalRepository caravanPrincipalRepository)
        {
            _individualRepository = individualRepository;
            _caravanPrincipalRepository = caravanPrincipalRepository;
        }

        public async Task<GettingIncomingOrAcceptedRequestByDateQueryResponse> Handle(GettingIncomingOrAcceptedRequestByDateQuery request, CancellationToken cancellationToken)
        {
            var caravanRequests = await _caravanPrincipalRepository.GetAcceptedOrOnTheWayCaravansRequestsByDateAsync(request.Date, cancellationToken);
            var individualRequests = await _individualRepository.GetAcceptedOrOutGoingRequestsByDateAsync(request.Date, cancellationToken);
            var requests = caravanRequests.Concat(individualRequests).ToList();
            return GettingIncomingOrAcceptedRequestByDateQueryResponse.SucceededResponse(requests.ToGettingAcceptedRequestResponseDto());
        }
    }
}
