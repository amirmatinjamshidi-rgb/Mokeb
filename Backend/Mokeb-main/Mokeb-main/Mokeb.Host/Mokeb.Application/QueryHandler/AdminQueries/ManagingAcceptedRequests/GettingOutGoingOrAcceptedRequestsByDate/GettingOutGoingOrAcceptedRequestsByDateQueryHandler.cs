using MediatR;
using Mokeb.Application.Contracts;

namespace Mokeb.Application.QueryHandler.AdminQueries.ManagingAcceptedRequests.GettingOutGoingOrAcceptedRequestsByDate
{
    public class GettingOutGoingOrAcceptedRequestsByDateQueryHandler : IRequestHandler<GettingOutGoingOrAcceptedRequestsByDateQuery, GettingOutGoingOrAcceptedRequestsByDateQueryResponse>
    {
        private readonly IIndividualRepository _individualRepository;
        private readonly ICaravanPrincipalRepository _caravanPrincipalRepository;

        public GettingOutGoingOrAcceptedRequestsByDateQueryHandler(IIndividualRepository individualRepository, ICaravanPrincipalRepository caravanPrincipalRepository)
        {
            _individualRepository = individualRepository;
            _caravanPrincipalRepository = caravanPrincipalRepository;
        }

        public async Task<GettingOutGoingOrAcceptedRequestsByDateQueryResponse> Handle(GettingOutGoingOrAcceptedRequestsByDateQuery request, CancellationToken cancellationToken)
        {
            var caravanRequests = await _caravanPrincipalRepository.GetAcceptedOrOutGoingCaravansRequestsByDateAsync(request.Date, cancellationToken);
            var individualRequests = await _individualRepository.GetAcceptedOrOutGoingCaravansRequestsByDateAsync(request.Date, cancellationToken);
            var requests = caravanRequests.Concat(individualRequests).ToList();
            return GettingOutGoingOrAcceptedRequestsByDateQueryResponse.SucceededResponse(requests.ToGettingOutGoingOrAcceptedRequestResponseDto());
        }
    }
}
