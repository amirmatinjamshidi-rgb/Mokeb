using Mokeb.Domain.Model.Base;
using Mokeb.Domain.Model.Exceptions.RoomExceptions;
using System.ComponentModel.DataAnnotations;

namespace Mokeb.Domain.Model.Entities
{
    public class RoomAvailability : BaseEntity<Guid>
    {
        public RoomAvailability(DateOnly availableDay, uint availableCapacity)
        {
            Id = Guid.NewGuid();
            AvailableDay = availableDay;
            AvailableCapacity = availableCapacity;
        }

        public DateOnly AvailableDay { get; private set; }
        public uint AvailableCapacity { get; private set; }

        public Guid RoomId { get; private set; }
        public Room Room { get; private set; }

        [Timestamp]
        public byte[] RowVersion { get; set; }
        #region Behaviors
        public void RemoveFromCapacity(uint amount) => AvailableCapacity -= amount;

        public void AddFromCapacity(uint amount) => AvailableCapacity += amount;
        public void ChangeAvailableDate(DateOnly availableDate)
        {
            if (AvailableDay == availableDate)
                throw new NewDateIsEqualWithOldDateException();
            AvailableDay = availableDate;
        }
        #endregion
    }
}