using MediatR;
using Mokeb.Application.CommandHandler.Base;

namespace Mokeb.Application.CommandHandler.AdminCommands.AddingRoomAvailability
{
    public class AddingRoomAvailabilityCommand : CommandBase, IRequest<AddingRoomAvailabilityCommandResponse>
    {
        public Guid roomId { get; set; }

        /// <summary>Single day, or range start when ExitDate is set.</summary>
        public DateOnly DateOfAvailability { get; set; }

        /// <summary>Optional range end (inclusive). When set with DateOfAvailability, all days in between are activated.</summary>
        public DateOnly? ExitDate { get; set; }

        public override void Validate()
        {
            new AddingRoomAvailabilityCommandValidator().Validate(this).ThrowIfNeeded();
        }
    }
}
