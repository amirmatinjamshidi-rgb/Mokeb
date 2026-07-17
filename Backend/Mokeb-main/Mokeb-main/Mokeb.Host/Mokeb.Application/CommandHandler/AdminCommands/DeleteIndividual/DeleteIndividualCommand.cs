using MediatR;
using Mokeb.Application.CommandHandler.Base;
using Mokeb.Application.CommandHandler.Base.Extension;

namespace Mokeb.Application.CommandHandler.AdminCommands.DeleteIndividual
{
    public class DeleteIndividualCommand : CommandBase, IRequest<DeleteIndividualCommandResponse>
    {
        public Guid IndividualId { get; set; }
        public override void Validate()
        {
            new DeleteIndividualCommandValidator().Validate(this).ThrowIfNeeded();
        }
    }
}
