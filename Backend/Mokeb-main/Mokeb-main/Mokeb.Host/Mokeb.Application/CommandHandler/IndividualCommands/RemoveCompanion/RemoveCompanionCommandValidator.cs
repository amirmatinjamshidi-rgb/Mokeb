using FluentValidation;

namespace Mokeb.Application.CommandHandler.IndividualCommands.RemoveCompanion
{
    public class RemoveCompanionCommandValidator : AbstractValidator<RemoveCompanionCommand>
    {
        public RemoveCompanionCommandValidator()
        {
            RuleFor(x => x.IndividualId)
                .NotEmpty()
                .WithMessage("شناسه شخص حقیقی نمیتواند خالی باشد");

            RuleFor(x => x.CompanionId)
                .NotEmpty()
                .WithMessage("شناسه همسفر نمیتواند خالی باشد");
        }
    }
}
