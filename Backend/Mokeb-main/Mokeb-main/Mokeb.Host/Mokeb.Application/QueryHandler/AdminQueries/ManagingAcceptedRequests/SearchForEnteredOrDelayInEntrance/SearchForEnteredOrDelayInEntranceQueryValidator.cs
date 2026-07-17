using FluentValidation;

namespace Mokeb.Application.QueryHandler.AdminQueries.ManagingAcceptedRequests.SearchForEnteredOrDelayInEntrance
{
    public class SearchForEnteredOrDelayInEntranceQueryValidator : AbstractValidator<SearchForEnteredOrDelayInEntranceQuery>
    {
        public SearchForEnteredOrDelayInEntranceQueryValidator()
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
