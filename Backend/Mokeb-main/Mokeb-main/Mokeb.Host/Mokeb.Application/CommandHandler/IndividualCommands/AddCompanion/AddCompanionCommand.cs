using MediatR;
using Mokeb.Application.CommandHandler.Base;
using Mokeb.Application.CommandHandler.Base.Extension;
using Mokeb.Domain.Model.Enums;

namespace Mokeb.Application.CommandHandler.IndividualCommands.AddCompanion
{
    public class AddCompanionCommand : CommandBase, IRequest<AddCompanionCommandResponse>
    {
        public Guid IndividualId { get; set; }
        public string Name { get; set; }
        public string FamilyName { get; set; }
        public string NationalCode { get; set; }
        public string PassportNumber { get; set; }
        public DateOnly DateOfBirth { get; set; }
        public string PhoneNumber { get; set; }
        public string EmergencyPhoneNumber { get; set; }
        public Gender Gender { get; set; }
        public override void Validate()
        {
            new AddCompanionCommandValidator().Validate(this).ThrowIfNeeded();
        }
    }
}
