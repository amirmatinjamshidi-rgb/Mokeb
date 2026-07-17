using Mokeb.Domain.Model.Entities;
using Mokeb.Domain.Model.Enums;
using Mokeb.Domain.Model.ValueObjects;

namespace Mokeb.Application.CommandHandler.CaravanCommands.CaravanPrincipalSignIn
{
    public static class CaravanMapper
    {
        public static CaravanPrincipal ToIndividualPrincipal(this CaravanPrincipalSignInCommand command)
        {
            return new CaravanPrincipal(command.Name, command.FamilyName, command.NationalCode, command.DateOfBirth, command.Gender, command.PassportNumber
                , new ContactInformation(command.Gmail, command.PhoneNumber, command.EmergencyPhoneNumber), new IdentityInformation(command.Username, command.Password, Role.CaravanAccount, command.BloodType));
        }
    }
}
