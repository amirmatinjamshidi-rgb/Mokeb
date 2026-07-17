using FluentValidation;

namespace Mokeb.Application.CommandHandler.AdminCommands.EditFAQ
{
    public class EditFAQCommandValidator : AbstractValidator<EditFAQCommand>
    {
        public EditFAQCommandValidator()
        {
            RuleFor(x => x.FaqId)
                .NotEmpty()
                .WithMessage("ایدی سوال نمیتواند خالی باشد");

            RuleFor(x => x.Question)
                .NotEmpty()
                .WithMessage("متن سوال نمیتواند خالی باشد");

            RuleFor(x => x.Answer)
                .NotEmpty()
                .WithMessage("متن جواب نمیتواند خالی باشد");
        }
    }
}
