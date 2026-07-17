using MediatR;
using Mokeb.Application.CommandHandler.Base;
using Mokeb.Application.CommandHandler.Base.Extension;

namespace Mokeb.Application.CommandHandler.CaravanCommands.CaravanPrincipalLogIn
{
    public class CaravanPrincipalLogInCommand : CommandBase, IRequest<CaravanPrincipalLogInCommandResponse>
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public override void Validate()
        {
            new CaravanPrincipalLogInCommandValidator().Validate(this).ThrowIfNeeded();
        }
    }
}
