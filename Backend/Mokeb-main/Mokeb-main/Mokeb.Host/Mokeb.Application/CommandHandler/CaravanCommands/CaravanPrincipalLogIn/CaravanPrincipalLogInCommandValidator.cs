using FluentValidation;

namespace Mokeb.Application.CommandHandler.CaravanCommands.CaravanPrincipalLogIn
{
    public class CaravanPrincipalLogInCommandValidator : AbstractValidator<CaravanPrincipalLogInCommand>
    {
        public CaravanPrincipalLogInCommandValidator()
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
