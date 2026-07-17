using MediatR;
using Mokeb.Application.Contracts;
using Mokeb.Application.Exceptions;
using Mokeb.Application.QueryHandler.AdminQueries;
using Mokeb.Domain.Model.Entities;
using Mokeb.Domain.Model.Enums;
using ResponseModel = Mokeb.Application.QueryHandler.CaravanQueries.CaravanAcceptedRequests.CaravanAcceptedRequestsQueryResponse;
namespace Mokeb.Application.QueryHandler.CaravanQueries.CaravanAcceptedRequests
{
    public class CaravanAcceptedRequestsQueryHandler : IRequestHandler<CaravanAcceptedRequestsQuery, CaravanAcceptedRequestsQueryResponse>
    {
        private readonly ICaravanPrincipalRepository _caravanPrincipalRepository;

        public CaravanAcceptedRequestsQueryHandler(ICaravanPrincipalRepository caravanPrincipalRepository)
        {
            _caravanPrincipalRepository = caravanPrincipalRepository;
        }

        public async Task<CaravanAcceptedRequestsQueryResponse> Handle(CaravanAcceptedRequestsQuery request, CancellationToken cancellationToken)
        {
            var caravan = await GetCaravan(request.CaravanId, cancellationToken);
            var requests = caravan.Requests.Where(x => x.State == State.Accepted || x.State == State.Requested).ToList();
            return ResponseModel
                .Response()
                .WithRequests(requests.ToAcceptedRequestDto());
        }
        #region Private Methods
        private async Task<CaravanPrincipal> GetCaravan(Guid caravanId, CancellationToken ct)
        {
            var caravan = await _caravanPrincipalRepository.GetCaravanByIdAsync(caravanId, ct);
            if (caravan is null)
                throw new PrincipalNotFoundApplicationException();
            return caravan;
        }
        #endregion
    }
}
