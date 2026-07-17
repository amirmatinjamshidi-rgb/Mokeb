using FluentValidation;

namespace Mokeb.Application.CommandHandler.IndividualCommands.IndividualPrincipalSignIn
{
    public class IndividualPrincipalSignInCommandValidator : AbstractValidator<IndividualPrincipalSignInCommand>
    {
        public IndividualPrincipalSignInCommandValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .WithMessage("Name Can't Be null or empty");

            RuleFor(x => x.FamilyName)
                .NotEmpty()
                .WithMessage("FamilyName Can't Be null or empty");

            RuleFor(x => x.PhoneNumber)
                .NotEmpty()
                .WithMessage("PhoneNumber Can't Be empty")
                .Matches(@"^09\d{9}$")
                .WithMessage("PhoneNumber Is Invalid");

            RuleFor(x => x.EmergencyPhoneNumber)
                .NotEmpty()
                .WithMessage("PhoneNumber Can't Be empty")
                .Matches(@"^09\d{9}$")
                .WithMessage("PhoneNumber Is Invalid");

            RuleFor(x => x.DateOfBirth)
                .NotEmpty()
                .WithMessage("DateOfBirth Can't be empty");

            RuleFor(x => x.BloodType)
                .IsInEnum();

            RuleFor(x => x.Gender)
                .IsInEnum();

            RuleFor(x => x.Username)
                .NotEmpty()
                .WithMessage("Username Can't Be Null")
                ;
            RuleFor(x => x.PassportNumber)
                .NotEmpty()
                .WithMessage("Passport Number Can't Be Null");

            RuleFor(x => x.Password)
                .NotEmpty()
                .WithMessage("Password cant be empty")
                .Matches(@"^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=<>]).{8,}$")
                .WithMessage("Password should have at least one capital and one small letter with at least one symbol and It should be more than 8 Characters");

            RuleFor(x => x.Gmail)
                .NotEmpty()
                .WithMessage("Email Cant Be Null")
                .Matches(@"^[a-zA-Z0-9._%+-]+@gmail\.com$")
                .WithMessage("Only Gmail Is Allowed On this Field !");

            RuleFor(x => x.NationalCode)
                .NotEmpty()
                .WithMessage("کد ملی نمیتواند خالی باشد");
        }
    }
}
