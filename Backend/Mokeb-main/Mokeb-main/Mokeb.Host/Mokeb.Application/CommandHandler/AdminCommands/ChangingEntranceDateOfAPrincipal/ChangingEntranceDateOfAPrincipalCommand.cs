using MediatR;
using Mokeb.Application.CommandHandler.Base;
using Mokeb.Application.CommandHandler.Base.Extension;

namespace Mokeb.Application.CommandHandler.AdminCommands.ChangingEntranceDateOfACaravan
{
    public class ChangingEntranceDateOfAPrincipalCommand : CommandBase, IRequest<ChangingEntranceDateOfAPrincipalCommandResponse>
    {
        public DateOnly Date { get; set; }
        public Guid RequestId { get; set; }

        public override void Validate()
        {
            new ChangingEntranceDateOfAPrincipalCommandValidator().Validate(this).ThrowIfNeeded();
        }
    }
}
