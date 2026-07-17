using Mokeb.Domain.Model.Entities;

namespace Mokeb.Application.CommandHandler.OfficialsCommands.AddOfficials
{
    public static class OfficialsMapper
    {
        public static Officials ToOfficials(this AddOfficialsCommand command) => new Officials(command.Name , command.LastName , command.PhoneNumber);
    }
}
