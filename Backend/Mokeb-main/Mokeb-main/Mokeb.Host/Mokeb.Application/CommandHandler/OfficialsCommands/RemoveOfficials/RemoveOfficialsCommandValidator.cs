using FluentValidation;

namespace Mokeb.Application.CommandHandler.OfficialsCommands.RemoveOfficials
{
    public class RemoveOfficialsCommandValidator : AbstractValidator<RemoveOfficialsCommand>
    {
        public RemoveOfficialsCommandValidator()
        {
            RuleFor(x => x.OfficialId)
                .NotEmpty()
                .WithMessage("شناسه نمیتواند خالی باشد");
        }
    }
}
