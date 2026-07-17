using FluentValidation;

namespace Mokeb.Application.CommandHandler.AdminCommands.AcceptingARequestedRequest
{
    public class AcceptingARequestedRequestCommandValidator : AbstractValidator<AcceptingARequestedRequestCommand>
    {
        public AcceptingARequestedRequestCommandValidator()
        {
            RuleFor(x => x.RequestId)
                .NotEmpty()
                .WithMessage("ایدی درخواست نمیتواند خالی باشد");

            RuleFor(x => x.RoomAvailabilityIds)
                .NotEmpty()
                .WithMessage("لیست اتاق ها نمیتواند خالی باشد");
        }
    }
}
