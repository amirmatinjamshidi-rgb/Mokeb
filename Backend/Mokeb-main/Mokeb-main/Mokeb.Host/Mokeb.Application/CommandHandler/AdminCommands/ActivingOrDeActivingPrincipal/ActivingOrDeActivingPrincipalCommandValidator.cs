using FluentValidation;

namespace Mokeb.Application.CommandHandler.AdminCommands.ActivingPrincipal
{
    public class ActivingOrDeActivingPrincipalCommandValidator : AbstractValidator<ActivingOrDeActivingPrincipalCommand>
    {
        public ActivingOrDeActivingPrincipalCommandValidator()
        {
            RuleFor(x => x.PrincipalId)
                .NotEmpty()
                .WithMessage("ایدی شخص نمیتواند خالی باشد");

            RuleFor(x => x.ActiveOrDeactive)
                .NotEmpty()
                .WithMessage("فعال یا غیر فعال کردن نمیتواند خالی باشد");
        }
    }
}
