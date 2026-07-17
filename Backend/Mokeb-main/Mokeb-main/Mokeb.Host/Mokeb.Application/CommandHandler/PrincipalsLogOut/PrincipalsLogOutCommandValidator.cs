using FluentValidation;

namespace Mokeb.Application.CommandHandler.PrincipalsLogOut
{
    public class PrincipalsLogOutCommandValidator : AbstractValidator<PrincipalsLogOutCommand>
    {
        public PrincipalsLogOutCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty()
                .WithMessage("Id Cant be empty");
        }
    }
}
