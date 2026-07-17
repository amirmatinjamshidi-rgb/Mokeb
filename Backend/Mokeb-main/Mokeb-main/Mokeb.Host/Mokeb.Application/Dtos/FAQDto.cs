namespace Mokeb.Application.Dtos
{
    public class FAQDto
    {
        public FAQDto(Guid id, string question, string answer)
        {
            Id = id;
            Question = question;
            Answer = answer;
        }

        public Guid Id { get; set; }
        public string Question { get; set; }
        public string Answer { get; set; }
    }
}
