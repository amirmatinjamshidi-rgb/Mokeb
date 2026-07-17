using FluentValidation;

namespace Mokeb.Application.CommandHandler.AdminCommands.RemovingRoomAvailability
{
    public class UpdatingRoomAvailabilityDateCommandValidator : AbstractValidator<UpdatingRoomAvailabilityDateCommand>
    {
        public UpdatingRoomAvailabilityDateCommandValidator()
        {
            RuleFor(x => x.AvailabilityId)
                .NotEmpty()
                .WithMessage("Availability Id can't be empty");
        }
    }
}
