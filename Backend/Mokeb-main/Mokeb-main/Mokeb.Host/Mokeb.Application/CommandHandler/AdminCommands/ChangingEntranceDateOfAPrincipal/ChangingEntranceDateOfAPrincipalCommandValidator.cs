using FluentValidation;

namespace Mokeb.Application.CommandHandler.AdminCommands.ChangingEntranceDateOfACaravan
{
    public class ChangingEntranceDateOfAPrincipalCommandValidator : AbstractValidator<ChangingEntranceDateOfAPrincipalCommand>
    {
        public ChangingEntranceDateOfAPrincipalCommandValidator()
        {
            RuleFor(x => x.Date)
                .NotEmpty()
                .WithMessage("Date Can't be empty");
        }
    }
}
