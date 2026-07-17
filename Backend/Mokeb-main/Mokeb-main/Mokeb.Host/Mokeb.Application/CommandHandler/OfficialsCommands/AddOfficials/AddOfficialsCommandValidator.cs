using FluentValidation;

namespace Mokeb.Application.CommandHandler.OfficialsCommands.AddOfficials
{
    public class AddOfficialsCommandValidator : AbstractValidator<AddOfficialsCommand>
    {
        public AddOfficialsCommandValidator()
        {
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
