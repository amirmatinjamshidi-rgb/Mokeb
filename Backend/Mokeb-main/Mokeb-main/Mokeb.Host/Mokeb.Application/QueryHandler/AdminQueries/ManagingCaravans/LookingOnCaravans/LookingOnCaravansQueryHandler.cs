using MediatR;
using Mokeb.Application.Contracts;
using ResponseModel = Mokeb.Application.QueryHandler.AdminQueries.ManagingCaravans.LookingOnCaravans.LookingOnCaravansQueryResponse;

namespace Mokeb.Application.QueryHandler.AdminQueries.ManagingCaravans.LookingOnCaravans
{
    public class LookingOnCaravansQueryHandler : IRequestHandler<LookingOnCaravansQuery, LookingOnCaravansQueryResponse>
    {
        private readonly ICaravanPrincipalRepository _caravanPrincipalRepository;

        public LookingOnCaravansQueryHandler(ICaravanPrincipalRepository caravanPrincipalRepository)
        {
            _caravanPrincipalRepository = caravanPrincipalRepository;
        }

        public async Task<LookingOnCaravansQueryResponse> Handle(LookingOnCaravansQuery query, CancellationToken ct)
        {
            var listOfCaravans = await _caravanPrincipalRepository.GetAllCaravansWithTheirTravelers(ct);
            return ResponseModel
                .Response()
                .WithResponse(listOfCaravans);
        }
    }
}
