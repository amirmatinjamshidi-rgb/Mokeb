using FluentValidation;

namespace Mokeb.Application.CommandHandler.AdminCommands.AddingRoomAvailability
{
    public class AddingRoomAvailabilityCommandValidator : AbstractValidator<AddingRoomAvailabilityCommand>
    {
        public AddingRoomAvailabilityCommandValidator()
        {
            RuleFor(x => x.roomId)
                .NotEmpty()
                .WithMessage("RoomId can't be empty");
            RuleFor(x => x.DateOfAvailability)
                .NotEmpty()
                .WithMessage("Date Can't be empty");
        }
    }
}
