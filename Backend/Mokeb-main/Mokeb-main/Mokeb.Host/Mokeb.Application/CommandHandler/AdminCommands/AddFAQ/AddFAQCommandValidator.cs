using FluentValidation;

namespace Mokeb.Application.CommandHandler.AdminCommands.AddFAQ
{
    public class AddFAQCommandValidator : AbstractValidator<AddFAQCommand>
    {
        public AddFAQCommandValidator()
        {
            RuleFor(x => x.Question)
                .NotEmpty()
                .WithMessage("متن سوال نمیتواند خالی باشد");

            RuleFor(x => x.Answer)
                .NotEmpty()
                .WithMessage("متن جواب نمیتواند خالی باشد");
        }
    }
}
