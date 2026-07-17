using FluentValidation;

namespace Mokeb.Application.QueryHandler.CaravanQueries.CaravanRequests
{
    public class CaravanRequestsQueryValidator : AbstractValidator<CaravanRequestsQuery>
    {
        public CaravanRequestsQueryValidator()
        {
            RuleFor(x => x.CaravanId)
                .NotEmpty()
                .WithMessage("شناسه کاروان نمیتواند خالی باشد");
        }
    }
}
