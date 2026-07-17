namespace Mokeb.Application.Dtos
{
    public class BiennialBookingStatsDto
    {
        public BiennialBookingStatsDto(int caravanAmount, int individualAmount, int previousCaravanAmount, int previousIndividualAmount)
        {
            CaravanAmount = caravanAmount;
            IndividualAmount = individualAmount;
            PreviousCaravanAmount = previousCaravanAmount;
            PreviousIndividualAmount = previousIndividualAmount;
        }

        public int CaravanAmount { get; set; }
        public int IndividualAmount { get; set; }
        public int PreviousCaravanAmount { get; set; }
        public int PreviousIndividualAmount { get; set; }
    }
}
