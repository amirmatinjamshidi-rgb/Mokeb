using FluentValidation;

namespace Mokeb.Application.QueryHandler.AdminQueries.ManagingIndividuals.SearchInIndividuals
{
    public class SearchInIndividualsQueryValidator : AbstractValidator<SearchInIndividualsQuery>
    {
        public SearchInIndividualsQueryValidator()
        {
            RuleFor(x => x.Input)
                .NotEmpty()
                .WithMessage("ورودی نمیتواند خالی باشد")
                .Matches(@"^[\u0600-\u06FF\s]+$")
                .WithMessage("فقط حروف، عدد و فاصله مجاز است");
        }
    }
}
