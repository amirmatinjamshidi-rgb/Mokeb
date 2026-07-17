using FluentValidation;

namespace Mokeb.Application.CommandHandler.IndividualCommands.IndividualPrincipalLogIn
{
    public class IndividualPrincipalLogInCommandValidator : AbstractValidator<IndividualPrincipalLogInCommand>
    {
        public IndividualPrincipalLogInCommandValidator()
        {
            RuleFor(x => x.Username)
                .NotEmpty()
                .WithMessage("Username Cant be empty");
            RuleFor(x => x.Password)
                .NotEmpty()
                .WithMessage("Password Cant Be empty");
        }
    }
}
