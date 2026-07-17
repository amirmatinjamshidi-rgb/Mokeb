using MediatR;
using Mokeb.Application.CommandHandler.Base;
using Mokeb.Application.CommandHandler.Base.Extension;

namespace Mokeb.Application.CommandHandler.AdminCommands.AcceptingARequestedRequest
{
    public class AcceptingARequestedRequestCommand : CommandBase, IRequest<AcceptingARequestedRequestCommandResponse>
    {
        public Guid RequestId { get; set; }
        public List<Guid> RoomAvailabilityIds { get; set; }
        public override void Validate()
        {
            new AcceptingARequestedRequestCommandValidator().Validate(this).ThrowIfNeeded();
        }
    }
}
