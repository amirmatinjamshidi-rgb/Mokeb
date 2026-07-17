using FluentValidation;

namespace Mokeb.Application.CommandHandler.CaravanCommands.CaravanSendsRequest
{
    public class CaravanSendsRequestCommandValidator : AbstractValidator<CaravanSendsRequestCommand>
    {
        public CaravanSendsRequestCommandValidator()
        {
            RuleFor(x => x.CaravanId)
                .NotEmpty()
                .WithMessage("شناسه کاروان نمیتواند خالی باشد");

            RuleFor(x => x.MaleAmount)
                .GreaterThanOrEqualTo(0)
                .WithMessage("تعداد آقایان نمیتواند منفی باشد");

            RuleFor(x => x.FemaleAmount)
                .GreaterThanOrEqualTo(0)
                .WithMessage("تعداد خانم ها نمیتواند خالی باشد");

            RuleFor(x => x)
                .Must(x => x.MaleAmount + x.FemaleAmount > 0)
                .WithMessage("مجموع باید بیشتر از صفر باشد")
                .OverridePropertyName("Capacity");

            RuleFor(x => x.EnterTime)
                .NotEmpty()
                .WithMessage("تاریخ ورودی نمیتواند خالی باشد");

            RuleFor(x => x.ExitTime)
                .NotEmpty()
                .WithMessage("تاریخ خروحی نمیتواند خالی باشد");

        }
    }
}
