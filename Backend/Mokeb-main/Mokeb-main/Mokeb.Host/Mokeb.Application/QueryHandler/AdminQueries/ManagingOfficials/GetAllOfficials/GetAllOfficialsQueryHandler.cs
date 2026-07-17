using MediatR;
using Mokeb.Application.Contracts;
namespace Mokeb.Application.QueryHandler.AdminQueries.ManagingOfficials.GetAllOfficials
{
    public class GetAllOfficialsQueryHandler : IRequestHandler<GetAllOfficialsQuery, GetAllOfficialsQueryResponse>
    {
        private readonly IOfficialsRepository _officialsRepository;

        public GetAllOfficialsQueryHandler(IOfficialsRepository officialsRepository)
        {
            _officialsRepository = officialsRepository;
        }

        public async Task<GetAllOfficialsQueryResponse> Handle(GetAllOfficialsQuery request, CancellationToken cancellationToken)
        {
            var listOfOfficials = await _officialsRepository.GetAllOfficials(cancellationToken);
            return GetAllOfficialsQueryResponse
                .Response()
                .WithOfficials(listOfOfficials);
        }
    }
}
