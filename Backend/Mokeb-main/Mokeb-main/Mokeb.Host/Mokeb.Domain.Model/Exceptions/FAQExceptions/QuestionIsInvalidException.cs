using Mokeb.Common.Base.DomainExceptions;

namespace Mokeb.Domain.Model.Exceptions.FAQExceptions
{
    public class QuestionIsInvalidException : ValidationFailedDomainException
    {
        public QuestionIsInvalidException() : base("Question Can't be null or empty") { }
    }
}