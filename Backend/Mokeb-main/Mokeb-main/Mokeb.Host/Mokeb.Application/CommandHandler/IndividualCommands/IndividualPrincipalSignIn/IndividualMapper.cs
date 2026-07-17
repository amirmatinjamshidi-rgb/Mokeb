using Mokeb.Domain.Model.Entities;
using Mokeb.Domain.Model.Enums;
using Mokeb.Domain.Model.ValueObjects;

namespace Mokeb.Application.CommandHandler.IndividualCommands.IndividualPrincipalSignIn
{
    public static class IndividualMapper
    {

        public static IndividualPrincipal ToIndividualPrincipal(this IndividualPrincipalSignInCommand command)
        {
            return new IndividualPrincipal(command.Name, command.FamilyName, command.NationalCode, command.DateOfBirth, command.Gender, command.PassportNumber
                , new ContactInformation(command.Gmail, command.PhoneNumber, command.EmergencyPhoneNumber), new IdentityInformation(command.Username, command.Password, Role.Individual, command.BloodType));
        }

    }
}
