using MediatR;
using Mokeb.Application.Contracts;
using Mokeb.Application.Exceptions;
using Mokeb.Domain.Model.Entities;
using ResponseModel = Mokeb.Application.QueryHandler.CaravanQueries.SearchInPilgrims.SearchInPilgrimsQueryResponse;
namespace Mokeb.Application.QueryHandler.CaravanQueries.SearchInPilgrims
{
    public class SearchInPilgrimsQueryHandler : IRequestHandler<SearchInPilgrimsQuery, SearchInPilgrimsQueryResponse>
    {
        private readonly ICaravanPrincipalRepository _caravanPrincipalRepository;

        public SearchInPilgrimsQueryHandler(ICaravanPrincipalRepository caravanPrincipalRepository)
        {
            _caravanPrincipalRepository = caravanPrincipalRepository;
        }

        public async Task<SearchInPilgrimsQueryResponse> Handle(SearchInPilgrimsQuery request, CancellationToken cancellationToken)
        {
            var caravan = await GetCaravan(request.CaravanId, cancellationToken);
            return ResponseModel
                .Response()
                .WithPilgrims(caravan.Pilgrims.Where(x => x.Name.ToLower().Contains(request.Input) || x.FamilyName.ToLower().Contains(request.Input) ||
                x.NationalCode.Contains(request.Input) || x.PassportNumber.Contains(request.Input)).ToList());
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
