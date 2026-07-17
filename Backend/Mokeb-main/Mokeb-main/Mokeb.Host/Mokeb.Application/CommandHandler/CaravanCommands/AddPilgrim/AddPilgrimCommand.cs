using MediatR;
using Mokeb.Application.CommandHandler.Base;
using Mokeb.Application.CommandHandler.Base.Extension;
using Mokeb.Domain.Model.Enums;

namespace Mokeb.Application.CommandHandler.CaravanCommands.AddPilgrim
{
    public class AddPilgrimCommand : CommandBase, IRequest<AddPilgrimCommandResponse>
    {
        public Guid CaravanId { get; set; }
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
            new AddPilgrimCommandValidator()
                .Validate(this)
                .ThrowIfNeeded();
        }
    }
}
