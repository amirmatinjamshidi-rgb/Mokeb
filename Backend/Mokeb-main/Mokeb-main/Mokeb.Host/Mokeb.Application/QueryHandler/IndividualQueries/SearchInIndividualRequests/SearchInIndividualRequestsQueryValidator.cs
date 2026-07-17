using FluentValidation;

namespace Mokeb.Application.QueryHandler.IndividualQueries.SearchInIndividualRequests
{
    public class SearchInIndividualRequestsQueryValidator : AbstractValidator<SearchInIndividualRequestsQuery>
    {
        public SearchInIndividualRequestsQueryValidator()
        {
            RuleFor(x => x.IndividualId)
                .NotEmpty()
                .WithMessage("شناسه شخص نمیتواند خالی باشد");

            RuleFor(x => x.Date)
                .NotEmpty()
                .WithMessage("تاریخ نباید خالی باشد");
        }
    }
}
