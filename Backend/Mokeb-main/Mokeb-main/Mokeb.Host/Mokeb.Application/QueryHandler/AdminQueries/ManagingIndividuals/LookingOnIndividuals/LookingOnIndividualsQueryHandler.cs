using MediatR;
using Mokeb.Application.Contracts;
using ResponseModel = Mokeb.Application.QueryHandler.AdminQueries.ManagingIndividuals.LookingOnIndividuals.LookingOnIndividualsQueryResponse;

namespace Mokeb.Application.QueryHandler.AdminQueries.ManagingIndividuals.LookingOnIndividuals
{
    public class LookingOnIndividualsQueryHandler : IRequestHandler<LookingOnIndividualsQuery, LookingOnIndividualsQueryResponse>
    {
        private readonly IIndividualRepository _individualRepository;

        public LookingOnIndividualsQueryHandler(IIndividualRepository individualRepository)
        {
            _individualRepository = individualRepository;
        }

        public async Task<LookingOnIndividualsQueryResponse> Handle(LookingOnIndividualsQuery request, CancellationToken cancellationToken)
        {
            var individuals = await _individualRepository.GetAllIndividualsWithTheirCompanions(cancellationToken);
            return ResponseModel
                .Response()
                .WithResponse(individuals);
        }
    }
}
