namespace Mokeb.Application.Dtos
{

    public class MaleAndFemaleCount
    {
        public MaleAndFemaleCount(string subject, int maleCount, int maleOverall, int femaleCount, int femaleOverall, double overallPercentage)
        {
            Subject = subject;
            MaleCount = maleCount;
            MaleOverall = maleOverall;
            FemaleCount = femaleCount;
            FemaleOverall = femaleOverall;
            OverallPercentage = overallPercentage;
        }

        public string Subject { get; set; }
        public int MaleCount { get; set; }
        public int MaleOverall { get; set; }
        public int FemaleCount { get; set; }
        public int FemaleOverall { get; set; }
        public double OverallPercentage { get; set; }
    }

}
