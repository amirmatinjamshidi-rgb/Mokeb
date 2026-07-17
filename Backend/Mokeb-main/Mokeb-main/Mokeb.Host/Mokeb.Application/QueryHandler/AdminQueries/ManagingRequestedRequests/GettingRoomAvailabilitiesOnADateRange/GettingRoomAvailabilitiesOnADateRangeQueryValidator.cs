using FluentValidation;

namespace Mokeb.Application.QueryHandler.AdminQueries.ManagingRequestedRequests.GettingRoomAvailabilitiesOnADateRange
{
    public class GettingRoomAvailabilitiesOnADateRangeQueryValidator : AbstractValidator<GettingRoomAvailabilitiesOnADateRangeQuery>
    {
        public GettingRoomAvailabilitiesOnADateRangeQueryValidator()
        {
            RuleFor(x => x.EnterTime)
                .NotEmpty()
                .WithMessage("Date Can't be empty");

            RuleFor(x => x.ExitTime)
                .NotEmpty()
                .WithMessage("Date Can't be empty");
        }
    }
}
