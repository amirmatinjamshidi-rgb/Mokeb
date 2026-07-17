using MediatR;
using Mokeb.Application.CommandHandler.Base;
using Mokeb.Application.CommandHandler.Base.Extension;

namespace Mokeb.Application.CommandHandler.OfficialsCommands.AddOfficials
{
    public class AddOfficialsCommand : CommandBase, IRequest<AddOfficialsCommandResponse>
    {
        public string Name { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        public override void Validate()
        {
            new AddOfficialsCommandValidator().Validate(this).ThrowIfNeeded();
        }
    }
}
