using MediatR;
using Mokeb.Application.CommandHandler.Base;
using Mokeb.Application.CommandHandler.Base.Extension;

namespace Mokeb.Application.CommandHandler.IndividualCommands.RemoveCompanion
{
    public class RemoveCompanionCommand : CommandBase, IRequest<RemoveCompanionCommandResponse>
    {
        public Guid IndividualId { get; set; }
        public Guid CompanionId { get; set; }
        public override void Validate()
        {
            new RemoveCompanionCommandValidator()
                .Validate(this)
                .ThrowIfNeeded();
        }
    }
}
