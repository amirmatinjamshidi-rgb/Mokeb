using FluentValidation;

namespace Mokeb.Application.CommandHandler.AdminCommands.IncreasingRequestsNumberOfPeople
{
    public class AddingRoomAvailabilityToAnAcceptedRequestCommandValidator : AbstractValidator<AddingRoomAvailabilityToAnAcceptedRequestCommand>
    {
        public AddingRoomAvailabilityToAnAcceptedRequestCommandValidator()
        {
            RuleFor(x => x.RequestId)
                .NotEmpty()
                .WithMessage("RequestId Can't be null or empty");

            RuleFor(x => x.RoomAvailabilityId)
                .NotEmpty()
                .WithMessage("RoomId Can't be null or empty");

            RuleFor(x => x.Amount)
                .NotEmpty()
                .WithMessage("Amount Can't be null or empty");

        }
    }
}
