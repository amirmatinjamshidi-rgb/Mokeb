using Mokeb.Domain.Model.Enums;

namespace Mokeb.Application.Dtos
{
    public class RoomListItemDto
    {
        public RoomListItemDto(Guid id, string name, Gender gender, uint capacity)
        {
            Id = id;
            RoomId = id;
            Name = name;
            Gender = gender;
            Capacity = capacity;
        }

        public Guid Id { get; set; }
        public Guid RoomId { get; set; }
        public string Name { get; set; }
        public Gender Gender { get; set; }
        public uint Capacity { get; set; }
    }
}
