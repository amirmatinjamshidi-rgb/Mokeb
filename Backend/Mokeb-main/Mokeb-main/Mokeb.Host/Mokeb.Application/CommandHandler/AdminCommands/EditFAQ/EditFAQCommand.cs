using MediatR;
using Mokeb.Application.CommandHandler.Base;
using Mokeb.Application.CommandHandler.Base.Extension;

namespace Mokeb.Application.CommandHandler.AdminCommands.EditFAQ
{
    public class EditFAQCommand : CommandBase, IRequest<EditFAQCommandResponse>
    {
        public Guid FaqId { get; set; }
        public string Question { get; set; }
        public string Answer { get; set; }

        public override void Validate()
        {
            new EditFAQCommandValidator().Validate(this).ThrowIfNeeded();
        }
    }
}
