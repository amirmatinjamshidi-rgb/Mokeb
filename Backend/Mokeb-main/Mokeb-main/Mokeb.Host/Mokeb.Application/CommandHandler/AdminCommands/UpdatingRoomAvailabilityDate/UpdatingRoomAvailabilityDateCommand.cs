using MediatR;
using Mokeb.Application.CommandHandler.Base;
using Mokeb.Application.CommandHandler.Base.Extension;

namespace Mokeb.Application.CommandHandler.AdminCommands.RemovingRoomAvailability
{
    public class UpdatingRoomAvailabilityDateCommand : CommandBase, IRequest<UpdatingRoomAvailabilityDateCommandResponse>
    {
        public Guid AvailabilityId { get; set; }
        public DateOnly NewDate { get; set; }
        public override void Validate()
        {
            new UpdatingRoomAvailabilityDateCommandValidator().Validate(this).ThrowIfNeeded();
        }
    }
}
