using MediatR;
using Mokeb.Application.Contracts;
using ResponseModel = Mokeb.Application.QueryHandler.AdminQueries.RequestedRequestsAtADayAmount.RequestedRequestsAtADayAmountQueryResponse;
namespace Mokeb.Application.QueryHandler.AdminQueries.RequestedRequestsAtADayAmount
{
    public class RequestedRequestsAtADayAmountQueryHandler : IRequestHandler<RequestedRequestsAtADayAmountQuery, RequestedRequestsAtADayAmountQueryResponse>
    {
        private readonly ICaravanPrincipalRepository _caravanPrincipalRepository;

        public RequestedRequestsAtADayAmountQueryHandler(ICaravanPrincipalRepository caravanPrincipalRepository)
        {
            _caravanPrincipalRepository = caravanPrincipalRepository;
        }

        public async Task<RequestedRequestsAtADayAmountQueryResponse> Handle(RequestedRequestsAtADayAmountQuery request, CancellationToken cancellationToken)
        {
            var caravanRequestAmount = await _caravanPrincipalRepository.GetAllCaravanRequestedRequestsAmountInADay(request.Date, cancellationToken);
            return ResponseModel
                .Response()
                .WithAmount(caravanRequestAmount);
        }
    }
}
