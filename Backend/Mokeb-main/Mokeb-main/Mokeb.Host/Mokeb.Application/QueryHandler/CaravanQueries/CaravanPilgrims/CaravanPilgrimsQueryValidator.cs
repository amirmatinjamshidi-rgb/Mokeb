using FluentValidation;

namespace Mokeb.Application.QueryHandler.CaravanQueries.CaravanPilgrims
{
    public class CaravanPilgrimsQueryValidator : AbstractValidator<CaravanPilgrimsQuery>
    {
        public CaravanPilgrimsQueryValidator()
        {
            RuleFor(x => x.CaravanId)
                .NotEmpty()
                .WithMessage("شناسه کاروان نمیتواند خالی باشد");
        }
    }
}
