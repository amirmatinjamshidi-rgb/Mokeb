using FluentValidation;

namespace Mokeb.Application.CommandHandler.IndividualCommands.AddCompanion
{
    public class AddCompanionCommandValidator : AbstractValidator<AddCompanionCommand>
    {
        public AddCompanionCommandValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .WithMessage("نام نمیتواند خالی باشد");

            RuleFor(x => x.FamilyName)
                .NotEmpty()
                .WithMessage("نام خانوادگی نمیتواند خالی باشد");

            RuleFor(x => x.PhoneNumber)
                .NotEmpty()
                .WithMessage("شماره همراه نمیتواند خالی باشد")
                .Matches(@"^09\d{9}$")
                .WithMessage("شماره همراه معتبر نیست");

            RuleFor(x => x.EmergencyPhoneNumber)
                .NotEmpty()
                .WithMessage("شماره همراه اضطراری نمیتواند خالی باشد")
                .Matches(@"^09\d{9}$")
                .WithMessage("شماره همراه اضطراری باید معتبر نیست");

            RuleFor(x => x.DateOfBirth)
                .NotEmpty()
                .WithMessage(" تاریخ تولد نمیتواند خالی باشد");

            RuleFor(x => x.Gender)
                .IsInEnum();

            RuleFor(x => x.PassportNumber)
                .NotEmpty()
                .WithMessage("شماره پاسپورت نمیتواند خالی باشد");

            RuleFor(x => x.NationalCode)
                .NotEmpty()
                .WithMessage("کد ملی نمیتواند خالی باشد");
        }
    }

}
