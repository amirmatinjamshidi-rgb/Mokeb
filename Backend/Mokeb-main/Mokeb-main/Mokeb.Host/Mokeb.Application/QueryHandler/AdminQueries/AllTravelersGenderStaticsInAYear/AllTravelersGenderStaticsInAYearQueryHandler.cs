using MediatR;
using Mokeb.Application.CommandHandler.Base.Extension;
using Mokeb.Application.Contracts;
using Mokeb.Application.Dtos;
using ResponseModel = Mokeb.Application.QueryHandler.AdminQueries.AllTravelersGenderStaticsInAYear.AllTravelersGenderStaticsInAYearQueryResponse;

namespace Mokeb.Application.QueryHandler.AdminQueries.AllTravelersGenderStaticsInAYear
{
    public class AllTravelersGenderStaticsInAYearQueryHandler : IRequestHandler<AllTravelersGenderStaticsInAYearQuery, AllTravelersGenderStaticsInAYearQueryResponse>
    {
        private readonly ICaravanPrincipalRepository _caravanPrincipalRepository;
        private readonly IIndividualRepository _individualRepository;

        public AllTravelersGenderStaticsInAYearQueryHandler(ICaravanPrincipalRepository caravanPrincipalRepository, IIndividualRepository individualRepository)
        {
            _caravanPrincipalRepository = caravanPrincipalRepository;
            _individualRepository = individualRepository;
        }

        public async Task<AllTravelersGenderStaticsInAYearQueryResponse> Handle(AllTravelersGenderStaticsInAYearQuery request, CancellationToken cancellationToken)
        {
            var gregorionDate = request.Year.ToGregorianDateOnly();
            var caravanStats = await _caravanPrincipalRepository.GetTravelersOfRequestsStatInAYear(gregorionDate, cancellationToken);
            var individualStats = await _individualRepository.GetTravelersOfRequestsStatInAYear(gregorionDate, cancellationToken);
            return ResponseModel
                .Response()
                .WithResponse(new GenderStatsInAYearDto(caravanStats.MaleAmount + individualStats.MaleAmount, caravanStats.FemaleAmount + individualStats.FemaleAmount));
        }
    }
}
