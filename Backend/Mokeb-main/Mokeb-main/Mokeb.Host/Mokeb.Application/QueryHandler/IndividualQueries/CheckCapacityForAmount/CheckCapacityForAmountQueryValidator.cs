using FluentValidation;

namespace Mokeb.Application.QueryHandler.IndividualQueries.CheckCapacityForAmount
{
    public class CheckCapacityForAmountQueryValidator : AbstractValidator<CheckCapacityForAmountQuery>
    {
        public CheckCapacityForAmountQueryValidator()
        {
            RuleFor(x => x.IndividualId)
                .NotEmpty()
                .WithMessage("ایدی شخص نمیتواند خالی باشد");

            RuleFor(x => x.EnterTime)
                  .NotEmpty()
                  .WithMessage("تاریخ ورود الزامی است.");

            RuleFor(x => x.ExitTime)
                .NotEmpty()
                .WithMessage("تاریخ خروج الزامی است.")
                .GreaterThan(x => x.EnterTime)
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
        }
    }
}
