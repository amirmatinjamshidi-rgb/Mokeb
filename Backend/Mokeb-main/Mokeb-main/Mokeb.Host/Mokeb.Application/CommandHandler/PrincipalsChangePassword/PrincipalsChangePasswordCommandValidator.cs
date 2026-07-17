using FluentValidation;

namespace Mokeb.Application.CommandHandler.PrincipalsChangePassword
{
    public class PrincipalsChangePasswordCommandValidator : AbstractValidator<PrincipalsChangePasswordCommand>
    {
        public PrincipalsChangePasswordCommandValidator()
        {

            RuleFor(x => x.CurrentPassword)
                .NotEmpty()
                .WithMessage("رمز نمیتواند خالی باشد")
                .Matches(@"^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=<>]).{8,}$")
                .WithMessage("رمز باید حداقل شامل یک حرف بزرگ و یک حرف کوچک و شامل حداقل یک کاراکتر باشد و باید بیشتر از 8 کاراکتر باشد");


            RuleFor(x => x.NewPassword)
                .NotEmpty()
                .WithMessage("رمز نمیتواند خالی باشد")
                .Matches(@"^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=<>]).{8,}$")
                .WithMessage("رمز باید حداقل شامل یک حرف بزرگ و یک حرف کوچک و شامل حداقل یک کاراکتر باشد و باید بیشتر از 8 کاراکتر باشد");
        }
    }
}
