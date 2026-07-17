using Mokeb.Domain.Model.Base;
using Mokeb.Domain.Model.Exceptions.GalleryExceptions;

namespace Mokeb.Domain.Model.Entities
{
    public class Gallery : BaseEntity<Guid>
    {
        private Gallery() { }
        public Gallery(string filePath, string title, string detail, string adminUsername)
        {
            CheckFilePath(filePath);
            CheckTitle(title);
            CheckDetail(detail);

            FilePath = filePath;
            Title = title;
            Detail = detail;
            AdminUsername = adminUsername;
        }

        public string FilePath { get; private set; }
        public string Title { get; private set; }
        public string Detail { get; private set; }

        public string AdminUsername { get; private set; }

        #region Behaviors
        public void ChangeTitle(string title)
        {
            CheckTitle(title);
            Title = title;
        }
        public void ChangeDetail(string detail)
        {
            CheckDetail(detail);
            Detail = detail;
        }
        #endregion
        #region Validations
        public void CheckFilePath(string filePath)
        {
            if (string.IsNullOrEmpty(filePath))
                throw new FilePathCantBeEmptyException();
        }
        public void CheckTitle(string title)
        {
            if (string.IsNullOrEmpty(title))
                throw new TitleCantBeEmptyException();
        }
        public void CheckDetail(string detail)
        {
            if (string.IsNullOrEmpty(detail))
                throw new DetailCantBeEmptyException();
        }
        #endregion

    }
}
