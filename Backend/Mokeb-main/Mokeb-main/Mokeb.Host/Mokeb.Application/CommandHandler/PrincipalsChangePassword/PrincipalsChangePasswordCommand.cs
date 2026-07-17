using MediatR;
using Mokeb.Application.CommandHandler.Base;
using Mokeb.Application.CommandHandler.Base.Extension;

namespace Mokeb.Application.CommandHandler.PrincipalsChangePassword
{
    public class PrincipalsChangePasswordCommand : CommandBase, IRequest<PrincipalsChangePasswordCommandResponse>
    {
        public Guid Id { get; set; }
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
        public override void Validate()
        {
            new PrincipalsChangePasswordCommandValidator().Validate(this).ThrowIfNeeded();
        }
    }
}
