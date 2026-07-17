using Mokeb.Application.Dtos;
using Mokeb.Domain.Model.Entities;
namespace Mokeb.Application.CommandHandler.IndividualCommands.ReserveRoom
{
    public static class ReserveRoomMapper
    {
        public static Travelers ToTravelers(this IndividualPrincipal principal) => new Travelers(principal.Name, principal.FamilyName
            , principal.NationalCode, principal.DateOfBirth, principal.ContactInformation.PhoneNumber,
            principal.Gender, principal.PassportNumber, principal.ContactInformation.EmergencyPhoneNumber);

        public static Travelers ToTravelers(this TravelerDto travelerDto) => new Travelers(travelerDto.Name, travelerDto.LastName, travelerDto.NationalCode
            , travelerDto.DateOfBirth, travelerDto.PhoneNumber, travelerDto.Gender, travelerDto.PassportNumber, travelerDto.EmergencyPhoneNumber);

        public static Companion ToCompanion(this TravelerDto travelerDto, Guid principalId) => new Companion(travelerDto.Name, travelerDto.LastName, travelerDto.NationalCode
            , travelerDto.DateOfBirth, travelerDto.PhoneNumber, travelerDto.Gender, travelerDto.PassportNumber, principalId, travelerDto.EmergencyPhoneNumber);

        public static Pilgrim ToPilgrim(this TravelerDto travelerDto) => new Pilgrim(travelerDto.Name, travelerDto.LastName, travelerDto.NationalCode, travelerDto.DateOfBirth
            , travelerDto.PhoneNumber, travelerDto.Gender, travelerDto.PassportNumber, travelerDto.EmergencyPhoneNumber);

        public static Travelers ToTravelers(this CaravanPrincipal principal) => new Travelers(principal.Name, principal.FamilyName
            , principal.NationalCode, principal.DateOfBirth, principal.ContactInformation.PhoneNumber,
            principal.Gender, principal.PassportNumber, principal.ContactInformation.EmergencyPhoneNumber);

        public static Travelers ToTravelers(this Pilgrim pilgrim) => new Travelers(pilgrim.Name, pilgrim.FamilyName
            , pilgrim.NationalCode, pilgrim.DateOfBirth, pilgrim.PhoneNumber,
            pilgrim.Gender, pilgrim.PassportNumber, pilgrim.EmergencyPhoneNumber);
    }
}
