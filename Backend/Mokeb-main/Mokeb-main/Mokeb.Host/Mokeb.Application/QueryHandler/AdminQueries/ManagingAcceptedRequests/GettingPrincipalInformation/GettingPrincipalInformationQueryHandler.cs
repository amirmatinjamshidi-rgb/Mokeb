using MediatR;
using Mokeb.Application.Contracts;
using Mokeb.Application.Exceptions;
using Mokeb.Domain.Model.Base;

namespace Mokeb.Application.QueryHandler.AdminQueries.ManagingAcceptedRequests.GettingPrincipalInformation
{
    public class GettingPrincipalInformationQueryHandler : IRequestHandler<GettingPrincipalInformationQuery, GettingPrincipalInformationQueryResponse>
    {
        private readonly ICaravanPrincipalRepository _caravanPrincipalRepository;
        private readonly IIndividualRepository _individualRepository;

        public GettingPrincipalInformationQueryHandler(ICaravanPrincipalRepository caravanPrincipalRepository, IIndividualRepository individualRepository)
        {
            _caravanPrincipalRepository = caravanPrincipalRepository;
            _individualRepository = individualRepository;
        }

        public async Task<GettingPrincipalInformationQueryResponse> Handle(GettingPrincipalInformationQuery request, CancellationToken cancellationToken)
        {
            var principal = await GetPrincipal(request.PrincipalId, cancellationToken);
            return GettingPrincipalInformationQueryResponse.Response(principal.ToPrincipalDto());
        }

        #region Private Methods
        private async Task<Principal> GetPrincipal(Guid Id, CancellationToken ct)
        {
            var caravan = await _caravanPrincipalRepository.GetCaravanByIdAsync(Id, ct);
            if (caravan == null)
            {
                var individual = await _individualRepository.GetIndividualByIdAsync(Id, ct);
                if (individual != null)
                    return individual;
                else
                    throw new PrincipalNotFoundApplicationException();
            }
            return caravan;
        }
        #endregion
    }
}
