using MediatR;
using Mokeb.Application.CommandHandler.Base;
using Mokeb.Application.CommandHandler.Base.Extension;

namespace Mokeb.Application.CommandHandler.AdminCommands.AddFAQ
{
    public class AddFAQCommand : CommandBase, IRequest<AddFAQCommandResponse>
    {
        public string Question { get; set; }
        public string Answer { get; set; }

        public override void Validate()
        {
            new AddFAQCommandValidator().Validate(this).ThrowIfNeeded();
        }
    }
}
