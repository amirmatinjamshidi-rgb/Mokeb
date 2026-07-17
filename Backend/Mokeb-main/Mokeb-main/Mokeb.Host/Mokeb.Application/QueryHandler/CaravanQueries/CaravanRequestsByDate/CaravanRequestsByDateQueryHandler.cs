using MediatR;
using Mokeb.Application.Contracts;
using Mokeb.Application.Exceptions;
using Mokeb.Application.QueryHandler.AdminQueries;
using Mokeb.Domain.Model.Entities;
using ResponseModel = Mokeb.Application.QueryHandler.CaravanQueries.CaravanRequestsByDate.CaravanRequestsByDateQueryResponse;
namespace Mokeb.Application.QueryHandler.CaravanQueries.CaravanRequestsByDate
{
    public class CaravanRequestsByDateQueryHandler : IRequestHandler<CaravanRequestsByDateQuery, CaravanRequestsByDateQueryResponse>
    {
        private readonly ICaravanPrincipalRepository _caravanPrincipalRepository;

        public CaravanRequestsByDateQueryHandler(ICaravanPrincipalRepository caravanPrincipalRepository)
        {
            _caravanPrincipalRepository = caravanPrincipalRepository;
        }

        public async Task<CaravanRequestsByDateQueryResponse> Handle(CaravanRequestsByDateQuery request, CancellationToken cancellationToken)
        {
            var caravan = await GetPrincipal(request.CaravanId, cancellationToken);
            return ResponseModel
                .Response()
                .WithRequests(caravan.Requests.Where(x => DateOnly.FromDateTime(x.EnterTime) == request.Date || DateOnly.FromDateTime(x.ExitTime) == request.Date)
                .ToRequestDto());

        }
        #region Private Methods
        private async Task<CaravanPrincipal> GetPrincipal(Guid principalId, CancellationToken ct)
        {
            var caravan = await _caravanPrincipalRepository.GetCaravanByIdAsync(principalId, ct);
            if (caravan is null)
                throw new PrincipalNotFoundApplicationException();
            return caravan;
        }
        #endregion
    }
}
