using FluentValidation;

namespace Mokeb.Application.CommandHandler.AdminCommands.RemovingRoom
{
    public class RemovingRoomCommandValidator : AbstractValidator<RemovingRoomCommand>
    {
        public RemovingRoomCommandValidator()
        {
            RuleFor(x => x.roomId)
                .NotEmpty()
                .WithMessage("RoomId Can't be empty");
        }
    }
}
