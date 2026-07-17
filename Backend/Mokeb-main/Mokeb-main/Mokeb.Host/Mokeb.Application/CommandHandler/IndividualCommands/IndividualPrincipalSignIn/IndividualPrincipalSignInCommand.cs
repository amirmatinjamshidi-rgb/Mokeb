using MediatR;
using Mokeb.Application.CommandHandler.Base;
using Mokeb.Application.CommandHandler.Base.Extension;
using Mokeb.Domain.Model.Enums;

namespace Mokeb.Application.CommandHandler.IndividualCommands.IndividualPrincipalSignIn
{
    public class IndividualPrincipalSignInCommand : CommandBase, IRequest<IndividualPrincipalSignInCommandResponse>
    {
        public string Name { get; set; }
        public string FamilyName { get; set; }
        public string NationalCode { get; set; }
        public DateOnly DateOfBirth { get; set; }
        public Gender Gender { get; set; }
        public string PassportNumber { get; set; }
        public string Gmail { get; set; }
        public string PhoneNumber { get; set; }
        public string EmergencyPhoneNumber { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public BloodType BloodType { get; set; }
        public override void Validate()
        {
            new IndividualPrincipalSignInCommandValidator().Validate(this).ThrowIfNeeded();
        }
    }
}
