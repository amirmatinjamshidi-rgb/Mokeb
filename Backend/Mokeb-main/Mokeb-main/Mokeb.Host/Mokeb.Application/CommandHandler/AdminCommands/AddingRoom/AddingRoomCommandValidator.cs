using FluentValidation;

namespace Mokeb.Application.CommandHandler.AdminCommands.AddingRoom
{
    public class AddingRoomCommandValidator : AbstractValidator<AddingRoomCommand>
    {
        public AddingRoomCommandValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .WithMessage("Room name can't be empty");

            RuleFor(x => x.Gender)
                .IsInEnum();
        }
    }
}
