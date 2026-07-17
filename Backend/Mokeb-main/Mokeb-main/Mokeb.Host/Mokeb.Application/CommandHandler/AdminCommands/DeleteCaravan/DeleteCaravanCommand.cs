using MediatR;
using Mokeb.Application.CommandHandler.Base;
using Mokeb.Application.CommandHandler.Base.Extension;

namespace Mokeb.Application.CommandHandler.AdminCommands.DeleteCaravan
{
    public class DeleteCaravanCommand : CommandBase, IRequest<DeleteCaravanCommandResponse>
    {
        public Guid CaravanId { get; set; }
        public override void Validate()
        {
            new DeleteCaravanCommandValidator().Validate(this).ThrowIfNeeded();
        }
    }
}
