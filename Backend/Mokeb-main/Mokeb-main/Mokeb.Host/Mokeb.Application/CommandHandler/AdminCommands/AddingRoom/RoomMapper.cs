using Mokeb.Domain.Model.Entities;

namespace Mokeb.Application.CommandHandler.AdminCommands.AddingRoom
{
    public static class RoomMapper
    {
        public static Room ToRoom(this AddingRoomCommand command) => new Room(command.Name, command.Gender, command.Capacity);
    }
}
