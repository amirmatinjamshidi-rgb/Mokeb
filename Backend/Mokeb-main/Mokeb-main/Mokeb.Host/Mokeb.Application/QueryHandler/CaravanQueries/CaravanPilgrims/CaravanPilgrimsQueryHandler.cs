using MediatR;
using Mokeb.Application.Contracts;
using Mokeb.Application.Exceptions;
using Mokeb.Domain.Model.Entities;
using ResponseModel = Mokeb.Application.QueryHandler.CaravanQueries.CaravanPilgrims.CaravanPilgrimsQueryResponse;
namespace Mokeb.Application.QueryHandler.CaravanQueries.CaravanPilgrims
{
    public class CaravanPilgrimsQueryHandler : IRequestHandler<CaravanPilgrimsQuery, CaravanPilgrimsQueryResponse>
    {
        private readonly ICaravanPrincipalRepository _caravanPrincipalRepository;

        public CaravanPilgrimsQueryHandler(ICaravanPrincipalRepository caravanPrincipalRepository)
        {
            _caravanPrincipalRepository = caravanPrincipalRepository;
        }

        public async Task<CaravanPilgrimsQueryResponse> Handle(CaravanPilgrimsQuery request, CancellationToken cancellationToken)
        {
            var caravan = await GetCaravan(request.CaravanId, cancellationToken);
            return ResponseModel
                .Response()
                .WithPilgrims(caravan.Pilgrims.ToList());
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
