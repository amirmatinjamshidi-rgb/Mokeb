using FluentValidation;

namespace Mokeb.Application.CommandHandler.AdminCommands.DeleteCaravan
{
    public class DeleteCaravanCommandValidator : AbstractValidator<DeleteCaravanCommand>
    {
        public DeleteCaravanCommandValidator()
        {
            RuleFor(x => x.CaravanId)
                .NotEmpty()
                .WithMessage("ایدی کاروان نمیتواند خالی باشد");
        }
    }
}
