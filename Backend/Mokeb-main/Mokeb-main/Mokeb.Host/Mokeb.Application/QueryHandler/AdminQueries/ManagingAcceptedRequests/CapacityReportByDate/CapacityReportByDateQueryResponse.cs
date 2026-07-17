using Mokeb.Application.Dtos;

namespace Mokeb.Application.QueryHandler.AdminQueries.ManagingAcceptedRequests.CapacityReportByDate
{
    public class CapacityReportByDateQueryResponse
    {
        public static CapacityReportByDateQueryResponse ToResponse(double amountOfFilledCapacity, MaleAndFemaleCount presentAmounts, MaleAndFemaleCount entryAmounts, MaleAndFemaleCount outBoundAmounts)
        {
            return new CapacityReportByDateQueryResponse()
            {
                AmountOfFilledCapacity = amountOfFilledCapacity,
                PresentAmounts = presentAmounts,
                EntryAmounts = entryAmounts,
                OutBoundAmounts = outBoundAmounts
            };
        }
        public double AmountOfFilledCapacity { get; set; }
        public MaleAndFemaleCount PresentAmounts { get; set; }
        public MaleAndFemaleCount EntryAmounts { get; set; }
        public MaleAndFemaleCount OutBoundAmounts { get; set; }
    }
}
