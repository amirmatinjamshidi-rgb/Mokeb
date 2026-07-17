namespace Mokeb.Application.Dtos
{
    public class GenderStatsInAYearDto
    {
        public GenderStatsInAYearDto() { }
        public GenderStatsInAYearDto(uint maleAmount, uint femaleAmount)
        {
            MaleAmount = maleAmount;
            FemaleAmount = femaleAmount;
        }

        public uint MaleAmount { get; set; }
        public uint FemaleAmount { get; set; }
    }
}
