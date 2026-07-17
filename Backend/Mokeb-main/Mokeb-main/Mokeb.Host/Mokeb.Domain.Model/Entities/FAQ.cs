using Mokeb.Domain.Model.Base;
using Mokeb.Domain.Model.Exceptions.FAQExceptions;

namespace Mokeb.Domain.Model.Entities
{
    public class FAQ : BaseEntity<Guid>
    {
        public FAQ(string question, string answer)
        {
            CheckAnswer(answer);
            CheckQuestion(question);

            Id = Guid.NewGuid();
            Question = question;
            Answer = answer;
        }

        public string Question { get; private set; }
        public string Answer { get; private set; }

        #region Behaviors
        public void ChangeAnswer(string answer)
        {
            CheckAnswer(answer);
            Answer = answer;
        }
        public void ChangeQuestion(string question)
        {
            CheckQuestion(question);
            Question = question;
        }
        #endregion
        #region Behaviors
        public void CheckQuestion(string question)
        {
            if (string.IsNullOrEmpty(question))
                throw new QuestionIsInvalidException();
        }
        public void CheckAnswer(string answer)
        {
            if (string.IsNullOrEmpty(answer))
                throw new AnswerIsInvalidException();
        }
        #endregion
    }
}
