namespace Mokeb.Application.Test.Constants
{
    public class DateTimeConstants
    {
        public static DateOnly Today => DateOnly.FromDateTime(DateTime.Now);
        public static DateOnly Tommorow => DateOnly.FromDateTime(DateTime.Now.AddDays(1));
        public static DateOnly NDaysAfter(uint n) => DateOnly.FromDateTime(DateTime.Now.AddDays(n));
        public static DateOnly NDaysBefore(uint n) => DateOnly.FromDateTime(DateTime.Now.AddDays(-n));
    }
}
