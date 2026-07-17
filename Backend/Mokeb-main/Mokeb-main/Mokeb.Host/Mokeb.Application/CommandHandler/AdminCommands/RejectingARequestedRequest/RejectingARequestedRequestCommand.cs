using MediatR;
using Mokeb.Application.CommandHandler.Base;
using Mokeb.Application.CommandHandler.Base.Extension;

namespace Mokeb.Application.CommandHandler.AdminCommands.RejectingARequestedRequest
{
    public class RejectingARequestedRequestCommand : CommandBase, IRequest<RejectingARequestedRequestCommandResponse>
    {
        public Guid RequestId { get; set; }

        public override void Validate()
        {
            new RejectingARequestedRequestCommandValidator().Validate(this).ThrowIfNeeded();
        }
    }
}
