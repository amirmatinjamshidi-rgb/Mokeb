using Mokeb.Common.Base.Helper;
using Mokeb.Domain.Model.Base;
using Mokeb.Domain.Model.Enums;
using Mokeb.Domain.Model.Exceptions.CaravanExceptions;
using System.Text.RegularExpressions;

namespace Mokeb.Domain.Model.Entities
{
    public class Admin : BaseEntity<Guid>
    {
        public Role Role = Role.Admin;
        public Admin(string username, string password)
        {
            CheckPassword(password);
            CheckUsername(username);

            Id = Guid.NewGuid();
            Username = username;
            Password = Hasher.HashData(password);
        }
        public string Username { get; private set; }
        public string Password { get; private set; }

        #region Validations
        public void CheckUsername(string username)
        {
            if (string.IsNullOrWhiteSpace(username))
                throw new UsernameIsInvalidException();
        }

        public void CheckPassword(string password)
        {
            var pattern = @"^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=<>]).{8,}$";
            if (string.IsNullOrWhiteSpace(password) || !Regex.IsMatch(password, pattern))
                throw new PasswordInvalidException();
        }
        #endregion
    }
}
