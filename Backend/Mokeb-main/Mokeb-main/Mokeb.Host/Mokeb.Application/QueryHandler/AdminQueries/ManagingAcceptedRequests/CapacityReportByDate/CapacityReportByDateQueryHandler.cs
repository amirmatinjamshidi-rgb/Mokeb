using MediatR;
using Mokeb.Application.Contracts;
using Mokeb.Application.Dtos;

namespace Mokeb.Application.QueryHandler.AdminQueries.ManagingAcceptedRequests.CapacityReportByDate
{
    public class CapacityReportByDateQueryHandler : IRequestHandler<CapacityReportByDateQuery, CapacityReportByDateQueryResponse>
    {
        private readonly IRoomRepository _roomRepository;
        private readonly IIndividualRepository _individualRepository;
        private readonly ICaravanPrincipalRepository _caravanPrincipalRepository;

        public CapacityReportByDateQueryHandler(IRoomRepository roomRepository, IIndividualRepository individualRepository, ICaravanPrincipalRepository caravanPrincipalRepository)
        {
            _roomRepository = roomRepository;
            _individualRepository = individualRepository;
            _caravanPrincipalRepository = caravanPrincipalRepository;
        }

        public async Task<CapacityReportByDateQueryResponse> Handle(CapacityReportByDateQuery request, CancellationToken ct)
        {
            var overallCapacity = await _roomRepository.GetSumOfAllRoomsCapacities(ct);
            var availableCapacity = await _roomRepository.GetSumOfAvailableCapacityAtADay(request.Date, ct);
            var amountOfFilledCapacityResult = CalculateAmountOfFilledCapacity(overallCapacity, availableCapacity);

            var indEntryStats = await _individualRepository.GetEntryStatsAsync(request.Date, ct);
            var indExitStats = await _individualRepository.GetExitStatsAsync(request.Date, ct);
            var indPresentStats = await _individualRepository.GetPresentStatsAsync(request.Date, ct);

            var carEntryStats = await _caravanPrincipalRepository.GetEntryStatsAsync(request.Date, ct);
            var carExitStats = await _caravanPrincipalRepository.GetExitStatsAsync(request.Date, ct);
            var carPresentStats = await _caravanPrincipalRepository.GetPresentStatsAsync(request.Date, ct);


            var entryResult = CalculateFinalStats("Entries", indEntryStats, carEntryStats);

            var exitResult = CalculateFinalStats("OutBounds", indExitStats, carExitStats);

            var presentResult = CalculateFinalStats("Presents", indPresentStats, carPresentStats);

            return CapacityReportByDateQueryResponse.ToResponse(
                amountOfFilledCapacityResult,
                presentResult,
                entryResult,
                exitResult
            );
        }

        #region Private Methods

        private double CalculateAmountOfFilledCapacity(int overallCapacity, int availableCapacity)
        {
            if (overallCapacity == 0) return 0;
            return (double)(overallCapacity - availableCapacity) / overallCapacity * 100;
        }

        private MaleAndFemaleCount CalculateFinalStats(string subject, GenderStatsDto individual, GenderStatsDto caravan)
        {
            int totalMaleCount = individual.MaleCount + caravan.MaleCount;
            int totalFemaleCount = individual.FemaleCount + caravan.FemaleCount;

            int totalMaleExpected = individual.MaleExpected + caravan.MaleExpected;
            int totalFemaleExpected = individual.FemaleExpected + caravan.FemaleExpected;

            double overallPercentage = 0;
            int totalExpected = totalMaleExpected + totalFemaleExpected;

            if (totalExpected > 0)
            {
                overallPercentage = (double)(totalMaleCount + totalFemaleCount) / totalExpected * 100;
            }

            return new MaleAndFemaleCount(
                subject,
                totalMaleCount,
                totalMaleExpected,
                totalFemaleCount,
                totalFemaleExpected,
                overallPercentage
            );
        }

        #endregion
    }
}