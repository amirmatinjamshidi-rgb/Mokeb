using MediatR;
using Mokeb.Application.CommandHandler.Base;
using Mokeb.Application.CommandHandler.Base.Extension;

namespace Mokeb.Application.CommandHandler.AdminCommands.IncreasingRequestsNumberOfPeople
{
    public class AddingRoomAvailabilityToAnAcceptedRequestCommand : CommandBase, IRequest<AddingRoomAvailabilityToAnAcceptedRequestCommandResponse>
    {
        public Guid RequestId { get; set; }
        public Guid RoomAvailabilityId { get; set; }
        public uint Amount { get; set; }
        public override void Validate()
        {
            new AddingRoomAvailabilityToAnAcceptedRequestCommandValidator().Validate(this).ThrowIfNeeded();
        }
    }
}
