using Mokeb.Domain.Model.Enums;

namespace Mokeb.Application.Dtos
{
    public class RoomAvailabilitiesInformationInADateDto
    {
        public RoomAvailabilitiesInformationInADateDto(DateOnly date, uint reservedAmount, uint emptyCapacity, Gender gender)
        {
            Date = date;
            ReservedAmount = reservedAmount;
            EmptyCapacity = emptyCapacity;
            Gender = gender;
        }

        public DateOnly Date { get; set; }
        public uint ReservedAmount { get; set; }
        public uint EmptyCapacity { get; set; }
        public uint OverallCapacity { get; set; }
        public Gender Gender { get; set; }
    }
}
