using Mokeb.Domain.Model.Entities;

namespace Mokeb.Application.CommandHandler.AdminCommands.AddFAQ
{
    public static class FAQMapper
    {
        public static FAQ ToFaq(this AddFAQCommand command) => new FAQ(command.Question, command.Answer);
    }
}
