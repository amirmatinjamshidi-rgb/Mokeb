using FluentValidation;
using MediatR;
using Mokeb.Application.CommandHandler.Base;
using Mokeb.Application.CommandHandler.Base.Extension;

namespace Mokeb.Application.CommandHandler.AdminCommands.AdminLogIn
{
    public class AdminLogInCommand : CommandBase, IRequest<AdminLogInCommandResponse>
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public override void Validate()
        {
            new AdminLogInCommandValidator().Validate(this).ThrowIfNeeded();
        }
    }
}
