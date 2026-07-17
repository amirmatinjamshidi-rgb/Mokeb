using MediatR;
using Mokeb.Application.CommandHandler.Base;
using Mokeb.Application.CommandHandler.Base.Extension;

namespace Mokeb.Application.CommandHandler.OfficialsCommands.RemoveOfficials
{
    public class RemoveOfficialsCommand : CommandBase, IRequest<RemoveOfficialsCommandResponse>
    {
        public Guid OfficialId { get; set; }
        public override void Validate()
        {
            new RemoveOfficialsCommandValidator().Validate(this).ThrowIfNeeded();
        }
    }
}
