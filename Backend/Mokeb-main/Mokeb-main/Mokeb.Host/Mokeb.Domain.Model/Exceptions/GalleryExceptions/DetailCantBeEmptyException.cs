using Mokeb.Common.Base.DomainExceptions;

namespace Mokeb.Domain.Model.Exceptions.GalleryExceptions
{
    public class DetailCantBeEmptyException : ValidationFailedDomainException
    {
        public DetailCantBeEmptyException() : base("Details cant be empty !") { }
    }
}