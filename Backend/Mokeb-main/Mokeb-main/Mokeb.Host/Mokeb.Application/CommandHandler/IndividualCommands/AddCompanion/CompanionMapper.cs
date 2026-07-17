using Mokeb.Domain.Model.Entities;
namespace Mokeb.Application.CommandHandler.IndividualCommands.AddCompanion
{
    public static class CompanionMapper
    {
        public static Companion ToCompanion(this AddCompanionCommand command, Guid individualId) => new Companion(command.Name, command.FamilyName, command.NationalCode, command.DateOfBirth
                                                                                                , command.PhoneNumber, command.Gender, command.PassportNumber
                                                                                                , command.IndividualId, command.EmergencyPhoneNumber);
    }
}
