using FluentValidation;

namespace Mokeb.Application.QueryHandler.AdminQueries.ManagingAcceptedRequests.LookingOnRoomAvailabilitiesOnARangeOfDates
{
    public class LookingOnRoomAvailabilitiesOnARangeOfDatesQueryValidator : AbstractValidator<LookingOnRoomAvailabilitiesOnARangeOfDatesQuery>
    {
        public LookingOnRoomAvailabilitiesOnARangeOfDatesQueryValidator()
        {
            RuleFor(x => x.RequestId)
                .NotEmpty()
                .WithMessage("RequestId can't be null");
        }
    }
}
