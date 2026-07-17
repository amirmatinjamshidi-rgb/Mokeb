using Mokeb.Application.Exceptions;
using Mokeb.Domain.Model.Entities;
using Mokeb.Domain.Model.Enums;

namespace Mokeb.Application.CommandHandler.Base.Extension
{
    public static class RoomAvailabilitiesCalculator
    {
        public static void DecreaseFromRoomAvailableCapacity(List<RoomAvailability> roomAvailabilities, uint maleCount, uint femaleCount)
        {
            var groupedByDate = roomAvailabilities.GroupBy(x => x.AvailableDay);

            foreach (var dayGroup in groupedByDate)
            {
                var currentDayMaleNeeded = maleCount;
                var currentDayFemaleNeeded = femaleCount;

                var maleRoomsInThisDay = dayGroup.Where(x => x.Room.Gender == Gender.Male).ToList();

                foreach (var room in maleRoomsInThisDay)
                {
                    if (currentDayMaleNeeded == 0) break;

                    var amountToDeduct = currentDayMaleNeeded > room.AvailableCapacity ? room.AvailableCapacity : currentDayMaleNeeded;

                    room.RemoveFromCapacity(amountToDeduct);
                    currentDayMaleNeeded -= amountToDeduct;
                }

                if (currentDayMaleNeeded > 0)
                    throw new ThereIsNotEnoughSpaceException();


                var femaleRoomsInThisDay = dayGroup.Where(x => x.Room.Gender == Gender.Female).ToList();

                foreach (var room in femaleRoomsInThisDay)
                {
                    if (currentDayFemaleNeeded == 0) break;

                    var amountToDeduct = currentDayFemaleNeeded > room.AvailableCapacity ? room.AvailableCapacity : currentDayFemaleNeeded;

                    room.RemoveFromCapacity(amountToDeduct);
                    currentDayFemaleNeeded -= amountToDeduct;
                }

                if (currentDayFemaleNeeded > 0)
                    throw new ThereIsNotEnoughSpaceException();
            }
        }
        public static void IncreaseRoomAvailableCapacity(List<RoomAvailability> roomAvailabilities, uint maleCount, uint femaleCount)
        {
            var groupedByDate = roomAvailabilities.GroupBy(x => x.AvailableDay);

            foreach (var dayGroup in groupedByDate)
            {
                var currentDayMaleToFree = maleCount;
                var currentDayFemaleToFree = femaleCount;

                var maleRoomsInThisDay = dayGroup.Where(x => x.Room.Gender == Gender.Male).ToList();

                foreach (var room in maleRoomsInThisDay)
                {
                    if (currentDayMaleToFree == 0) break;

                    var occupiedSpace = room.Room.Capacity - room.AvailableCapacity;

                    if (occupiedSpace == 0) continue;

                    var amountToAdd = (uint)Math.Min(currentDayMaleToFree, occupiedSpace);

                    room.AddFromCapacity(amountToAdd);
                    currentDayMaleToFree -= amountToAdd;
                }

                var femaleRoomsInThisDay = dayGroup.Where(x => x.Room.Gender == Gender.Female).ToList();

                foreach (var room in femaleRoomsInThisDay)
                {
                    if (currentDayFemaleToFree == 0) break;

                    var occupiedSpace = room.Room.Capacity - room.AvailableCapacity;

                    if (occupiedSpace == 0) continue;

                    var amountToAdd = (uint)Math.Min(currentDayFemaleToFree, occupiedSpace);

                    room.AddFromCapacity(amountToAdd);
                    currentDayFemaleToFree -= amountToAdd;
                }
            }
        }
    }
}
