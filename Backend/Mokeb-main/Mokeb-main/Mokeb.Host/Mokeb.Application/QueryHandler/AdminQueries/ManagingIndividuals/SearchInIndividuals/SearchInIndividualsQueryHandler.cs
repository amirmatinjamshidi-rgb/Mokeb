using MediatR;
using Mokeb.Application.Contracts;
using ResponseModel = Mokeb.Application.QueryHandler.AdminQueries.ManagingIndividuals.SearchInIndividuals.SearchInIndividualsQueryResponse;
namespace Mokeb.Application.QueryHandler.AdminQueries.ManagingIndividuals.SearchInIndividuals
{
    public class SearchInIndividualsQueryHandler : IRequestHandler<SearchInIndividualsQuery, SearchInIndividualsQueryResponse>
    {
        private readonly IIndividualRepository _individualRepository;

        public SearchInIndividualsQueryHandler(IIndividualRepository individualRepository)
        {
            _individualRepository = individualRepository;
        }

        public async Task<SearchInIndividualsQueryResponse> Handle(SearchInIndividualsQuery request, CancellationToken cancellationToken)
        {
            var listOfIndividuals = await _individualRepository.SearchForIndividualsByNameOrFamilyName(request.Input, cancellationToken);
            return ResponseModel
                .Response()
                .WithResponse(listOfIndividuals);
        }
    }
}
