using MediatR;
using Mokeb.Application.Contracts;
using Mokeb.Application.Exceptions;
using Mokeb.Domain.Model.Entities;
using ResponseModel = Mokeb.Application.QueryHandler.IndividualQueries.SearchInIndividualCompanions.SearchInIndividualCompanionsQueryResponse;
namespace Mokeb.Application.QueryHandler.IndividualQueries.SearchInIndividualCompanions
{
    public class SearchInIndividualCompanionsQueryHandler : IRequestHandler<SearchInIndividualCompanionsQuery, SearchInIndividualCompanionsQueryResponse>
    {
        private readonly IIndividualRepository _individualRepository;

        public SearchInIndividualCompanionsQueryHandler(IIndividualRepository individualRepository)
        {
            _individualRepository = individualRepository;
        }

        public async Task<SearchInIndividualCompanionsQueryResponse> Handle(SearchInIndividualCompanionsQuery request, CancellationToken cancellationToken)
        {
            var individual = await GetIndividual(request.IndividualId, cancellationToken);
            var companions = SearchInCompanions(individual, request.Input);
            return ResponseModel
                .Response()
                .WithCompanions(companions);
        }
        #region Private Methods
        private async Task<IndividualPrincipal> GetIndividual(Guid individualId, CancellationToken ct)
        {
            var individual = await _individualRepository.GetIndividualByIdAsync(individualId, ct);
            if (individual is null)
                throw new PrincipalNotFoundApplicationException();
            return individual;
        }
        private List<Companion> SearchInCompanions(IndividualPrincipal principal, string input) => principal.Companion
            .Where(x => x.Name.ToLower().Contains(input.ToLower()) || x.FamilyName.ToLower().Contains(input.ToLower())
            || x.NationalCode.Contains(input) || x.PassportNumber.Contains(input)).ToList();
        #endregion
    }
}
