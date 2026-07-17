using MediatR;
using Mokeb.Application.CommandHandler.Base;
using Mokeb.Application.CommandHandler.Base.Extension;

namespace Mokeb.Application.CommandHandler.AdminCommands.RemovingRoom
{
    public class RemovingRoomCommand : CommandBase, IRequest<RemovingRoomCommandResponse>
    {
        public Guid roomId { get; set; }
        public override void Validate()
        {
            new RemovingRoomCommandValidator().Validate(this).ThrowIfNeeded();
        }
    }
}
