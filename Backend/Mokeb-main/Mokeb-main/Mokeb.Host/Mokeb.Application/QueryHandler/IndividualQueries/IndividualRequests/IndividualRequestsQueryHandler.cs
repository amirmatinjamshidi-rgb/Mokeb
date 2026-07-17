using MediatR;
using Mokeb.Application.Contracts;
using Mokeb.Application.Exceptions;
using Mokeb.Application.QueryHandler.AdminQueries;
using Mokeb.Domain.Model.Entities;
using ResponseModel = Mokeb.Application.QueryHandler.IndividualQueries.IndividualRequests.IndividualRequestsQueryResponse;
namespace Mokeb.Application.QueryHandler.IndividualQueries.IndividualRequests
{
    public class IndividualRequestsQueryHandler : IRequestHandler<IndividualRequestsQuery, IndividualRequestsQueryResponse>
    {
        private readonly IIndividualRepository _individualRepository;

        public IndividualRequestsQueryHandler(IIndividualRepository individualRepository)
        {
            _individualRepository = individualRepository;
        }

        public async Task<IndividualRequestsQueryResponse> Handle(IndividualRequestsQuery request, CancellationToken cancellationToken)
        {
            var individual = await GetIndividual(request.IndividualId, cancellationToken);
            var requests = individual.Requests.ToRequestDto();
            return ResponseModel
                .Response()
                .WithRequests(requests);
        }
        #region Private Methods
        private async Task<IndividualPrincipal> GetIndividual(Guid individualId, CancellationToken cancellationToken)
        {
            var individual = await _individualRepository.GetIndividualByIdAsync(individualId, cancellationToken);
            if (individual is null)
                throw new PrincipalNotFoundApplicationException();
            return individual;
        }
        #endregion
    }
}
