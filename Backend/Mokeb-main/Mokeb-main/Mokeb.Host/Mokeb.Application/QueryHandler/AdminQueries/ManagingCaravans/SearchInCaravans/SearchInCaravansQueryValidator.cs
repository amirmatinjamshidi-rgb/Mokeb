using FluentValidation;

namespace Mokeb.Application.QueryHandler.AdminQueries.ManagingCaravans.SearchInCaravans
{
    public class SearchInCaravansQueryValidator : AbstractValidator<SearchInCaravansQuery>
    {
        public SearchInCaravansQueryValidator()
        {
            RuleFor(x => x.Input)
                .NotEmpty()
                .WithMessage("ورودی نمیتواند خالی باشد")
                .Matches(@"^[\u0600-\u06FF\s]+$")
                .WithMessage("فقط حروف، عدد و فاصله مجاز است");
        }
    }
}
