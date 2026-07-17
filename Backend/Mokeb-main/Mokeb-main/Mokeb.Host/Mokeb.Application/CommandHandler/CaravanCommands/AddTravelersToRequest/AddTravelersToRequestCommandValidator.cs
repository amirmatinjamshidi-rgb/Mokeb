using FluentValidation;
using Mokeb.Application.CommandHandler.IndividualCommands.ReserveRoom;

namespace Mokeb.Application.CommandHandler.CaravanCommands.AddTravelersToRequest
{
    public class AddTravelersToRequestCommandValidator : AbstractValidator<AddTravelersToRequestCommand>
    {
        public AddTravelersToRequestCommandValidator()
        {
            RuleFor(x => x.CaravanId)
                .NotEmpty()
                .WithMessage("شناسه کاروان نمیتواند خالی باشد");

            RuleFor(x => x.RequestId)
                .NotEmpty()
                .WithMessage("شناسه درخواست نمیتواند خالی باشد");

            RuleForEach(x => x.Travelers)
                .SetValidator(x => new TravelerDtoValidator());
        }
    }
}
