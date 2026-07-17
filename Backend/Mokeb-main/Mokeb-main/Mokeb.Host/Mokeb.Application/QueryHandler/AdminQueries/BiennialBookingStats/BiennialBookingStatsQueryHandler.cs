using MediatR;
using Mokeb.Application.CommandHandler.Base.Extension;
using Mokeb.Application.Contracts;
using Mokeb.Application.Dtos;
using ResponseModel = Mokeb.Application.QueryHandler.AdminQueries.BiennialBookingStats.BiennialBookingStatsQueryResponse;
namespace Mokeb.Application.QueryHandler.AdminQueries.BiennialBookingStats
{
    public class BiennialBookingStatsQueryHandler : IRequestHandler<BiennialBookingStatsQuery, BiennialBookingStatsQueryResponse>
    {
        private readonly ICaravanPrincipalRepository _caravanPrincipalRepository;
        private readonly IIndividualRepository _individualRepository;

        public BiennialBookingStatsQueryHandler(ICaravanPrincipalRepository caravanPrincipalRepository, IIndividualRepository individualRepository)
        {
            _caravanPrincipalRepository = caravanPrincipalRepository;
            _individualRepository = individualRepository;
        }

        public async Task<BiennialBookingStatsQueryResponse> Handle(BiennialBookingStatsQuery request, CancellationToken cancellationToken)
        {
            var gregorianDate = request.Year.ToGregorianDateOnly();
            var previousDate = gregorianDate.AddYears(-1);
            var caravanAmount = await _caravanPrincipalRepository.GetAllCaravanRequestsAmountInAYear(gregorianDate, cancellationToken);
            var individualAmount = await _individualRepository.GetAllCaravanRequestsAmountInAYear(gregorianDate, cancellationToken);

            var previousCaravanAmount = await _caravanPrincipalRepository.GetAllCaravanRequestsAmountInAYear(previousDate, cancellationToken);
            var previousIndividualAmount = await _individualRepository.GetAllCaravanRequestsAmountInAYear(previousDate, cancellationToken);
            return ResponseModel
                .Response()
                .WithStats(new BiennialBookingStatsDto(caravanAmount, individualAmount, previousCaravanAmount, previousIndividualAmount));

        }
    }
}
