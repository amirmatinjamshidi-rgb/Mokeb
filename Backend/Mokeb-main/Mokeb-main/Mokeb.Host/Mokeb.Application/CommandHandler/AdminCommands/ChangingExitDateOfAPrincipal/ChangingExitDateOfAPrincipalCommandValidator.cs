using FluentValidation;

namespace Mokeb.Application.CommandHandler.AdminCommands.ChangingExitDateOfAPrincipal
{
    public class ChangingExitDateOfAPrincipalCommandValidator : AbstractValidator<ChangingExitDateOfAPrincipalCommand>
    {
        public ChangingExitDateOfAPrincipalCommandValidator()
        {
            RuleFor(x => x.Date)
                .NotEmpty()
                .WithMessage("Date Can't be empty");

            RuleFor(x => x.RequestId)
                .NotEmpty()
                .WithMessage("RequestId can't be null");
        }
    }
}
