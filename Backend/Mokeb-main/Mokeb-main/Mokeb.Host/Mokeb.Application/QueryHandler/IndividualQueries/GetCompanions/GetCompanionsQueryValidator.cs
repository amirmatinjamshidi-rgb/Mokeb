using FluentValidation;

namespace Mokeb.Application.QueryHandler.IndividualQueries.GetCompanions
{
    public class GetCompanionsQueryValidator : AbstractValidator<GetCompanionsQuery>
    {
        public GetCompanionsQueryValidator()
        {
            RuleFor(x => x.IndividualId)
                .NotEmpty()
                .WithMessage("شناسه شخص حقیقی نمیتواند خالی باشد");
        }
    }
}
