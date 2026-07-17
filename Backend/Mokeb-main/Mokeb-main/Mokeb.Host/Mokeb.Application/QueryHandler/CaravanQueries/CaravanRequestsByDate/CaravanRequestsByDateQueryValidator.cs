using FluentValidation;

namespace Mokeb.Application.QueryHandler.CaravanQueries.CaravanRequestsByDate
{
    public class CaravanRequestsByDateQueryValidator : AbstractValidator<CaravanRequestsByDateQuery>
    {
        public CaravanRequestsByDateQueryValidator()
        {
            RuleFor(x => x.CaravanId)
                .NotEmpty()
                .WithMessage("شناسه کاروان نمیتواند خالی باشد");

            RuleFor(x => x.Date)
                .NotEmpty()
                .WithMessage("تاریخ نمیتواند خالی باشد");
        }
    }
}
