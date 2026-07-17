using MediatR;
using Mokeb.Application.CommandHandler.Base;

namespace Mokeb.Application.CommandHandler.AdminCommands.AddingRoomAvailability
{
    public class AddingRoomAvailabilityCommand : CommandBase, IRequest<AddingRoomAvailabilityCommandResponse>
    {
        public Guid roomId { get; set; }
        public DateOnly DateOfAvailability { get; set; }
        public override void Validate()
        {

        }
    }
}
