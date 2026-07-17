using FluentValidation;

namespace Mokeb.Application.QueryHandler.AdminQueries.ManagingAcceptedRequests.GettingOutGoingOrAcceptedRequestsByDate
{
    public class GettingOutGoingOrAcceptedRequestsByDateQueryValidator : AbstractValidator<GettingOutGoingOrAcceptedRequestsByDateQuery>
    {
        public GettingOutGoingOrAcceptedRequestsByDateQueryValidator()
        {
            RuleFor(x => x.Date)
                .NotEmpty()
                .WithMessage("Date Can't be empty");
        }
    }
}
