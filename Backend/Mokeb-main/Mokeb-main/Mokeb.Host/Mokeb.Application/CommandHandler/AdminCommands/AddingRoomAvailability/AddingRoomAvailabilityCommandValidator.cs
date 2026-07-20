using FluentValidation;

namespace Mokeb.Application.CommandHandler.AdminCommands.AddingRoomAvailability
{
    public class AddingRoomAvailabilityCommandValidator : AbstractValidator<AddingRoomAvailabilityCommand>
    {
        public AddingRoomAvailabilityCommandValidator()
        {
            RuleFor(x => x.roomId)
                .NotEmpty()
                .WithMessage("RoomId is required");

            RuleFor(x => x.DateOfAvailability)
                .NotEmpty()
                .WithMessage("Enter date is required");

            RuleFor(x => x)
                .Must(x => !x.ExitDate.HasValue || x.ExitDate.Value >= x.DateOfAvailability)
                .WithMessage("Exit date must be on or after enter date");
        }
    }
}
