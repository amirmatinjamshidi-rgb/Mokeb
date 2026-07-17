using MediatR;
using Mokeb.Application.CommandHandler.Base;
using Mokeb.Application.CommandHandler.Base.Extension;

namespace Mokeb.Application.CommandHandler.PrincipalsLogOut
{
    public class PrincipalsLogOutCommand : CommandBase, IRequest<PrincipalsLogOutCommandResponse>
    {
        public Guid Id { get; set; }
        public override void Validate()
        {
            new PrincipalsLogOutCommandValidator().Validate(this).ThrowIfNeeded();
        }
    }
}
