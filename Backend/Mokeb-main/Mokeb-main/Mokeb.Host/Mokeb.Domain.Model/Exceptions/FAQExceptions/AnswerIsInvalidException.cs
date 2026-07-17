using Mokeb.Common.Base.DomainExceptions;

namespace Mokeb.Domain.Model.Exceptions.FAQExceptions
{
    public class AnswerIsInvalidException : ValidationFailedDomainException
    {
        public AnswerIsInvalidException() : base("Answer Can't be null or empty") { }
    }
}