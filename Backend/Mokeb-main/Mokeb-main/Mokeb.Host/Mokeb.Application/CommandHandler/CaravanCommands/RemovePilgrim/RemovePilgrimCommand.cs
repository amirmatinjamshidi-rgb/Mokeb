using MediatR;
using Mokeb.Application.CommandHandler.Base;
using Mokeb.Application.CommandHandler.Base.Extension;

namespace Mokeb.Application.CommandHandler.CaravanCommands.RemovePilgrim
{
    public class RemovePilgrimCommand : CommandBase, IRequest<RemovePilgrimCommandResponse>
    {
        public Guid CaravanId { get; set; }
        public string NationalCode { get; set; }
        public override void Validate()
        {
            new RemovePilgrimCommandValidator().Validate(this)
                .ThrowIfNeeded();
        }
    }
}
