using MediatR;
using Mokeb.Application.CommandHandler.Base;
using Mokeb.Application.CommandHandler.Base.Extension;

namespace Mokeb.Application.CommandHandler.AdminCommands.ActivingPrincipal
{
    public class ActivingOrDeActivingPrincipalCommand : CommandBase, IRequest<ActivingOrDeActivingPrincipalCommandResponse>
    {
        public Guid PrincipalId { get; set; }
        public bool ActiveOrDeactive { get; set; }

        public override void Validate()
        {
            new ActivingOrDeActivingPrincipalCommandValidator().Validate(this).ThrowIfNeeded();
        }
    }
}
