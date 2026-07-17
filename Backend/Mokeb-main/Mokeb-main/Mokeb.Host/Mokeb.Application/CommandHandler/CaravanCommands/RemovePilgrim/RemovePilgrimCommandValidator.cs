using FluentValidation;

namespace Mokeb.Application.CommandHandler.CaravanCommands.RemovePilgrim
{
    public class RemovePilgrimCommandValidator : AbstractValidator<RemovePilgrimCommand>
    {
        public RemovePilgrimCommandValidator()
        {
            RuleFor(x => x.CaravanId)
                .NotEmpty()
                .WithMessage("شناسه کاروان نمیتواند خالی باشد");

            RuleFor(x => x.NationalCode)
                .NotEmpty()
                .WithMessage("کدملی زاعر نمیتواند خالی باشد");
        }
    }
}
