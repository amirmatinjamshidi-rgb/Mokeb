using FluentValidation;

namespace Mokeb.Application.QueryHandler.AdminQueries.ManagingAcceptedRequests.SearchForExitedOrDelayInExited
{
    public class SearchForExitedOrDelayInExitedQueryValidator : AbstractValidator<SearchForExitedOrDelayInExitedQuery>
    {
        public SearchForExitedOrDelayInExitedQueryValidator()
        {
            RuleFor(x => x.Input)
                .NotEmpty()
                .WithMessage("ورودی نمیتواند خالی باشد")
                .Matches(@"^[\u0600-\u06FF\s]+$")
                .WithMessage("فقط حروف، عدد و فاصله مجاز است");

            RuleFor(x => x.Date)
                .NotEmpty()
                .WithMessage("ورودی نمیتواند خالی باشد");
        }
    }
}
