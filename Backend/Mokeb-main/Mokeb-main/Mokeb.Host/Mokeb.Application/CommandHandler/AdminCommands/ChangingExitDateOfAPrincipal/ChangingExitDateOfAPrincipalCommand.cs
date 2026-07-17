using MediatR;
using Mokeb.Application.CommandHandler.Base;
using Mokeb.Application.CommandHandler.Base.Extension;

namespace Mokeb.Application.CommandHandler.AdminCommands.ChangingExitDateOfAPrincipal
{
    public class ChangingExitDateOfAPrincipalCommand : CommandBase, IRequest<ChangingExitDateOfAPrincipalCommandResponse>
    {
        public DateOnly Date { get; set; }
        public Guid RequestId { get; set; }

        public override void Validate()
        {
            new ChangingExitDateOfAPrincipalCommandValidator().Validate(this).ThrowIfNeeded();
        }
    }
}
