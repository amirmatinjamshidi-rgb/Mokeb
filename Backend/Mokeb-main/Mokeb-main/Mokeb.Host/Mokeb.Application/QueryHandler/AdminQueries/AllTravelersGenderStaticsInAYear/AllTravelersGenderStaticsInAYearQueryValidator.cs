using FluentValidation;

namespace Mokeb.Application.QueryHandler.AdminQueries.AllTravelersGenderStaticsInAYear
{
    public class AllTravelersGenderStaticsInAYearQueryValidator : AbstractValidator<AllTravelersGenderStaticsInAYearQuery>
    {
        public AllTravelersGenderStaticsInAYearQueryValidator()
        {
            RuleFor(x => x.Year)
                .NotEmpty()
                .WithMessage("سال نمیتواند خالی باشد");
        }
    }
}
