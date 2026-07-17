using FluentValidation;

namespace Mokeb.Application.QueryHandler.AdminQueries.RequestedRequestsAtADayAmount
{
    public class RequestedRequestsAtADayAmountQueryValidator : AbstractValidator<RequestedRequestsAtADayAmountQuery>
    {
        public RequestedRequestsAtADayAmountQueryValidator()
        {
            RuleFor(x => x.Date)
                .NotEmpty()
                .WithMessage("تاریخ نمیتواند خالی باشد");
        }
    }
}
