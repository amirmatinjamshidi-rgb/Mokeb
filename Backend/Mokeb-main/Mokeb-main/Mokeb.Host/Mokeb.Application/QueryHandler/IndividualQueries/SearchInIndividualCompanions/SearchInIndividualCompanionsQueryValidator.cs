using FluentValidation;

namespace Mokeb.Application.QueryHandler.IndividualQueries.SearchInIndividualCompanions
{
    public class SearchInIndividualCompanionsQueryValidator : AbstractValidator<SearchInIndividualCompanionsQuery>
    {
        public SearchInIndividualCompanionsQueryValidator()
        {
            RuleFor(x => x.IndividualId)
                .NotEmpty()
                .WithMessage("شناسه شخص حقیقی نمیتواند خالی باشد");

            RuleFor(x => x.Input)
                .NotEmpty()
                .WithMessage("ورودی نمیتواند خالی باشد");
        }
    }
}
