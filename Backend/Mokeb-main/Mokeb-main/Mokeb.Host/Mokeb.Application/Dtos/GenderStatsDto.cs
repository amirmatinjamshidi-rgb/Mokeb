namespace Mokeb.Application.Dtos
{
    public class GenderStatsDto
    {
        public GenderStatsDto() { }
        public GenderStatsDto(int maleCount, int maleExpected, int femaleCount, int femaleExpected, double overallPercentage)
        {
            MaleCount = maleCount;
            MaleExpected = maleExpected;
            FemaleCount = femaleCount;
            FemaleExpected = femaleExpected;
            OverallPercentage = overallPercentage;
        }
        public int MaleCount { get; set; }
        public int MaleExpected { get; set; }
        public int FemaleCount { get; set; }
        public int FemaleExpected { get; set; }
        public double? OverallPercentage { get; set; }
    }
}
