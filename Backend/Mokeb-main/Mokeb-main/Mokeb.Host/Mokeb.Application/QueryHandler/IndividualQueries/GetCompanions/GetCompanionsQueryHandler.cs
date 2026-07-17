using MediatR;
using Mokeb.Application.Contracts;
using Mokeb.Application.Exceptions;
using Mokeb.Domain.Model.Entities;
using ResponseModel = Mokeb.Application.QueryHandler.IndividualQueries.GetCompanions.GetCompanionsQueryResponse;
namespace Mokeb.Application.QueryHandler.IndividualQueries.GetCompanions
{
    public class GetCompanionsQueryHandler : IRequestHandler<GetCompanionsQuery, GetCompanionsQueryResponse>
    {
        private readonly IIndividualRepository _individualRepository;

        public GetCompanionsQueryHandler(IIndividualRepository individualRepository)
        {
            _individualRepository = individualRepository;
        }

        public async Task<GetCompanionsQueryResponse> Handle(GetCompanionsQuery request, CancellationToken cancellationToken)
        {
            var individual = await GetIndividual(request.IndividualId, cancellationToken);
            return ResponseModel
                .Response()
                .WithCompanions(individual.Companion);


        }
        #region Private Methods
        private async Task<IndividualPrincipal> GetIndividual(Guid individualId, CancellationToken ct)
        {
            var individual = await _individualRepository.GetIndividualByIdAsync(individualId, ct);
            if (individual is null)
                throw new PrincipalNotFoundApplicationException();
            return individual;
        }
        #endregion
    }
}
