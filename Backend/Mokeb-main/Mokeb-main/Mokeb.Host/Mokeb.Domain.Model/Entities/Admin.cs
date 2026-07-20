using Mokeb.Common.Base.Helper;
using Mokeb.Domain.Model.Base;
using Mokeb.Domain.Model.Enums;
using Mokeb.Domain.Model.Exceptions.CaravanExceptions;

namespace Mokeb.Domain.Model.Entities
{
    public class Admin : BaseEntity<Guid>
    {
        public Role Role = Role.Admin;

        private Admin() { } // EF

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

        /// <summary>Seed helper — bypasses password complexity (dev default admin/admin).</summary>
        public static Admin CreateSeed(Guid id, string username, string plainPassword)
        {
            CheckUsernameStatic(username);
            if (string.IsNullOrWhiteSpace(plainPassword))
                throw new PasswordInvalidException();

            return new Admin
            {
                Id = id,
                Username = username,
                Password = Hasher.HashData(plainPassword),
            };
        }

        #region Validations
        public void CheckUsername(string username) => CheckUsernameStatic(username);

        private static void CheckUsernameStatic(string username)
        {
            if (string.IsNullOrWhiteSpace(username))
                throw new UsernameIsInvalidException();
        }

        public void CheckPassword(string password)
        {
            // Admin passwords: non-empty, min 4 chars (dev uses admin/admin).
            if (string.IsNullOrWhiteSpace(password) || password.Length < 4)
                throw new PasswordInvalidException();
        }
        #endregion
    }
}
