using MediatR;
using Mokeb.Application.Contracts;
using ResponseModel = Mokeb.Application.QueryHandler.AdminQueries.ManagingCaravans.SearchInCaravans.SearchInCaravansQueryResponse;
namespace Mokeb.Application.QueryHandler.AdminQueries.ManagingCaravans.SearchInCaravans
{
    public class SearchInCaravansQueryHandler : IRequestHandler<SearchInCaravansQuery, SearchInCaravansQueryResponse>
    {
        private readonly ICaravanPrincipalRepository _caravanPrincipalRepository;

        public SearchInCaravansQueryHandler(ICaravanPrincipalRepository caravanPrincipalRepository)
        {
            _caravanPrincipalRepository = caravanPrincipalRepository;
        }

        public async Task<SearchInCaravansQueryResponse> Handle(SearchInCaravansQuery request, CancellationToken cancellationToken)
        {
            var listOfCaravans = await _caravanPrincipalRepository.SearchForCaravansByNameOrFamilyName(request.Input, cancellationToken);
            return ResponseModel
                .Response()
                .WithResponse(listOfCaravans);
        }
    }
}
