using FluentValidation;
using Mokeb.Application.Dtos;

namespace Mokeb.Application.CommandHandler.IndividualCommands.ReserveRoom
{
    public class ReserveRoomCommandValidator : AbstractValidator<ReserveRoomCommand>
    {
        public ReserveRoomCommandValidator()
        {
            RuleFor(x => x.IndividualId)
                .NotEmpty()
                .WithMessage("ایدی شخص نمیتواند خالی باشد");

            RuleFor(x => x.DateOfEntrance)
                  .NotEmpty()
                  .WithMessage("تاریخ ورود الزامی است.");

            RuleFor(x => x.DateOfExit)
                .NotEmpty()
                .WithMessage("تاریخ خروج الزامی است.")
                .GreaterThan(x => x.DateOfEntrance)
                .WithMessage("تاریخ خروج باید بعد از تاریخ ورود باشد.");

            RuleFor(x => x.MaleAmount)
                .LessThanOrEqualTo(4)
                .WithMessage("تعداد اقایان نمیتواند بیشتر از 4 باشد");

            RuleFor(x => x.FemaleAmount)
                .LessThanOrEqualTo(4)
                .WithMessage("تعداد خانوم ها نمیتواند بیشتر از 4 باشد");

            RuleFor(x => x.MaleAmount)
                .Must((model, maleCount) => maleCount + model.FemaleAmount < 5)
                .WithMessage("مجموع تعداد آقایان و خانم‌ها باید کمتر از ۵ نفر باشد.");

            RuleFor(x => x)
                .Must(x => x.MaleAmount + x.FemaleAmount > 0)
                .WithMessage("حداقل باید یک مسافر انتخاب شود.")
                .OverridePropertyName("Capacity");

            RuleFor(x => x)
                .Must(x => x.Travelers != null && x.Travelers.Count == (x.MaleAmount + x.FemaleAmount))
                .WithMessage("تعداد مسافران وارد شده در لیست با مجموع تعداد نفرات همخوانی ندارد.");

            RuleForEach(x => x.Travelers)
                .SetValidator(x => new TravelerDtoValidator());
        }
    }
    public class TravelerDtoValidator : AbstractValidator<TravelerDto>
    {
        public TravelerDtoValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .WithMessage("Name Can't Be null or empty");

            RuleFor(x => x.LastName)
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

            RuleFor(x => x.Gender)
                .IsInEnum();

            RuleFor(x => x.PassportNumber)
                .NotEmpty()
                .WithMessage("Passport Number Can't Be Null");
        }
    }
}
