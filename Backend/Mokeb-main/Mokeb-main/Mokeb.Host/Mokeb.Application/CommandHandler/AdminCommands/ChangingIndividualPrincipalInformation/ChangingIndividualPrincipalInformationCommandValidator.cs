using FluentValidation;

namespace Mokeb.Application.CommandHandler.AdminCommands.ChangingIndividualPrincipalInformation
{
    public class ChangingIndividualPrincipalInformationCommandValidator : AbstractValidator<ChangingIndividualPrincipalInformationCommand>
    {
        public ChangingIndividualPrincipalInformationCommandValidator()
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
                .WithMessage("شماره همراه معتبر نیست");

            RuleFor(x => x.DateOfBirth)
                .NotEmpty()
                .WithMessage("تاریخ تولد نمیتواند خالی باشد");

            RuleFor(x => x.BloodType)
                .IsInEnum();

            RuleFor(x => x.Gender)
                .IsInEnum();
            ;
            RuleFor(x => x.PassportNumber)
                .NotEmpty()
                .WithMessage("شماره پاسپورت نمیتواند خالی باشد");

            RuleFor(x => x.Gmail)
                .NotEmpty()
                .WithMessage("ایمیل نمیتواند خالی باشد")
                .Matches(@"^[a-zA-Z0-9._%+-]+@gmail\.com$")
                .WithMessage("فقط جیمیل مجاز است");
        }
    }
}
