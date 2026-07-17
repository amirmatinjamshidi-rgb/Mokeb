using FluentValidation;

namespace Mokeb.Application.CommandHandler.OfficialsCommands.EditOfficials
{
    public class EditOfficialsCommandValidator : AbstractValidator<EditOfficialsCommand>
    {
        public EditOfficialsCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty()
                .WithMessage("شناسه نمیتواند خالی باشد");

            RuleFor(x => x.Name)
                .NotEmpty()
                .WithMessage("اسم نمیتواند خالی باشد");

            RuleFor(x => x.LastName)
                .NotEmpty()
                .WithMessage("فامیلی نمیتواند خالی باشد");


            RuleFor(x => x.PhoneNumber)
                .NotEmpty()
                .WithMessage("شماره تلفن نمیتواند خالی باشد")
                .Matches(@"^09\d{9}$")
                .WithMessage("شماره تلفن اشتباه است");
        }
    }
}
