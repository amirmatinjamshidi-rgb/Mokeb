using FluentValidation;

namespace Mokeb.Application.QueryHandler.AdminQueries.ManagingRequestedRequests.LookingOnRequestedRequests
{
    public class LookingOnRequestedRequestsQueryValidator : AbstractValidator<LookingOnRequestedRequestsQuery>
    {
        public LookingOnRequestedRequestsQueryValidator()
        {
            RuleFor(x => x.EntranceDate)
                .NotEmpty()
                .WithMessage("Date Can't be empty");
        }
    }
}
