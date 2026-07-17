using FluentValidation;

namespace Mokeb.Application.QueryHandler.AdminQueries.ManagingAcceptedRequests.CapacityReportByDate
{
    public class CapacityReportByDateQueryValidator : AbstractValidator<CapacityReportByDateQuery>
    {
        public CapacityReportByDateQueryValidator()
        {
            RuleFor(x => x.Date)
                .NotEmpty()
                .WithMessage("Date Can't be empty");
        }
    }
}
