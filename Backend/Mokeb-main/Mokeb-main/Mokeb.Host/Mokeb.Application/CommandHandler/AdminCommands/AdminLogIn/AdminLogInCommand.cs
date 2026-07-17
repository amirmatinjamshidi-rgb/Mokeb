using MediatR;
using Mokeb.Application.CommandHandler.Base;

namespace Mokeb.Application.CommandHandler.AdminCommands.AdminLogIn
{
    public class AdminLogInCommand : CommandBase, IRequest<AdminLogInCommandResponse>
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public override void Validate()
        {
            throw new NotImplementedException();
        }
    }
}
