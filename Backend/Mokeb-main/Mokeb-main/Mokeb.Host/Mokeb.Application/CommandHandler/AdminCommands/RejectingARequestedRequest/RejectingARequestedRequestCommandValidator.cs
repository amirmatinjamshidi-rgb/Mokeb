using FluentValidation;

namespace Mokeb.Application.CommandHandler.AdminCommands.RejectingARequestedRequest
{
    public class RejectingARequestedRequestCommandValidator : AbstractValidator<RejectingARequestedRequestCommand>
    {
        public RejectingARequestedRequestCommandValidator()
        {
            RuleFor(x => x.RequestId)
                .NotEmpty()
                .WithMessage("ایدی درخواست نمیتواند خالی باشد");
        }
    }
}
