using FluentValidation;

namespace Mokeb.Application.QueryHandler.IndividualQueries.CreateRequestPdf
{
    public class CreateRequestPdfQueryValidator : AbstractValidator<CreateRequestPdfQuery>
    {
        public CreateRequestPdfQueryValidator()
        {
            RuleFor(x => x.RequestId)
                .NotEmpty()
                .WithMessage("شناسه درخواست نمیتواند خالی باشد");
        }
    }
}
