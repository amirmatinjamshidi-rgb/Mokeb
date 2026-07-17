using FluentValidation;

namespace Mokeb.Application.QueryHandler.AdminQueries.BiennialBookingStats
{
    public class BiennialBookingStatsQueryValidator : AbstractValidator<BiennialBookingStatsQuery>
    {
        public BiennialBookingStatsQueryValidator()
        {
            RuleFor(x => x.Year)
                .NotEmpty()
                .WithMessage("سال نمیتواند خالی باشد");
        }
    }
}
