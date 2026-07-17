
using FluentValidation;

namespace Mokeb.Application.QueryHandler.CaravanQueries.CaravanAcceptedRequests
{
    public class CaravanAcceptedRequestsQueryValidator : AbstractValidator<CaravanAcceptedRequestsQuery>
    {
        public CaravanAcceptedRequestsQueryValidator()
        {
            RuleFor(x => x.CaravanId)
                .NotEmpty()
                .WithMessage("شناسه کاروان نمیتواند خالی باشد");
        }
    }
}
