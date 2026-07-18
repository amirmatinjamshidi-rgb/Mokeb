using System.Globalization;

namespace Mokeb.Application.CommandHandler.Base.Extension
{
    public static class NumbersExtensions
    {
        public static int AsInt(this bool value) => value ? 1 : 0;
    }
    public static class DateExtensions
    {
        public static List<DateOnly> GetRangeTo(this DateOnly startDate, DateOnly endDate)
        {
            var dates = new List<DateOnly>();
            for (var dt = startDate; dt < endDate; dt = dt.AddDays(1))
            {
                dates.Add(dt);
            }
            return dates;
        }

        /// <summary>
        /// Accepts Persian dates:
        /// - "1404/01/01" (full)
        /// - "1404" (year only → Farvardin 1 of that year; used by chart stats APIs)
        /// </summary>
        public static DateOnly ToGregorianDateOnly(this string persianDate)
        {
            if (string.IsNullOrWhiteSpace(persianDate))
                throw new ArgumentException("Date cannot be empty.", nameof(persianDate));

            var normalized = persianDate.Trim()
                .Replace('-', '/')
                .Replace('.', '/');

            var parts = normalized.Split('/', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
            if (parts.Length == 0)
                throw new FormatException($"Invalid Persian date: '{persianDate}'");

            int year = int.Parse(parts[0], CultureInfo.InvariantCulture);
            int month = parts.Length > 1 ? int.Parse(parts[1], CultureInfo.InvariantCulture) : 1;
            int day = parts.Length > 2 ? int.Parse(parts[2], CultureInfo.InvariantCulture) : 1;

            var pc = new PersianCalendar();
            var dateTime = pc.ToDateTime(year, month, day, 0, 0, 0, 0);
            return DateOnly.FromDateTime(dateTime);
        }
    }
}
