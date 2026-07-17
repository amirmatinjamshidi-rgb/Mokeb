using MediatR;
using Mokeb.Application.CommandHandler.Base;
using Mokeb.Application.CommandHandler.Base.Extension;

namespace Mokeb.Application.CommandHandler.IndividualCommands.IndividualPrincipalLogIn
{
    public class IndividualPrincipalLogInCommand : CommandBase, IRequest<IndividualPrincipalLogInCommandResponse>
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public override void Validate()
        {
            new IndividualPrincipalLogInCommandValidator().Validate(this).ThrowIfNeeded();
        }
    }
}
