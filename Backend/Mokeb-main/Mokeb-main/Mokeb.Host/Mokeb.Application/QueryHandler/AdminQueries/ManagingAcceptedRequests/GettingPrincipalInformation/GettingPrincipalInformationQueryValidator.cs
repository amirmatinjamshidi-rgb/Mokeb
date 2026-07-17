using FluentValidation;

namespace Mokeb.Application.QueryHandler.AdminQueries.ManagingAcceptedRequests.GettingPrincipalInformation
{
    public class GettingPrincipalInformationQueryValidator : AbstractValidator<GettingPrincipalInformationQuery>
    {
        public GettingPrincipalInformationQueryValidator()
        {
            RuleFor(x => x.PrincipalId)
                .NotEmpty()
                .WithMessage("CaravanId Can't be empty");
        }
    }
}
