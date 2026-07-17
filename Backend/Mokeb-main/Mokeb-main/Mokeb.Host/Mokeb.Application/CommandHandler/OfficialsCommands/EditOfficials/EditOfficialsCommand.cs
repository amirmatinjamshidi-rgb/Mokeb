using MediatR;
using Mokeb.Application.CommandHandler.Base;
using Mokeb.Application.CommandHandler.Base.Extension;

namespace Mokeb.Application.CommandHandler.OfficialsCommands.EditOfficials
{
    public class EditOfficialsCommand : CommandBase, IRequest<EditOfficialsCommandResponse>
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }

        public override void Validate()
        {
            new EditOfficialsCommandValidator().Validate(this).ThrowIfNeeded();
        }
    }
}
