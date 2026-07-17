using Mokeb.Common.Base.Helper;
using Mokeb.Domain.Model.Enums;
using Mokeb.Domain.Model.Exceptions.CaravanExceptions;
using System.Text.RegularExpressions;

namespace Mokeb.Domain.Model.ValueObjects
{
    public class IdentityInformation
    {
        private IdentityInformation() { }
        public IdentityInformation(string username, string password, Role role, BloodType bloodType)
        {
            CheckUsername(username);
            CheckPassword(password);

            Username = username;
            Password = Hasher.HashData(password);
            Role = role;
            BloodType = bloodType;
        }

        public string Username { get; protected set; }
        public string Password { get; protected set; }
        public Role Role { get; protected set; }
        public BloodType BloodType { get; protected set; }

        #region Behaviors
        public void ChangeUsername(string username)
        {
            CheckUsername(username);
            Username = username;
        }
        public void ChangePassword(string password)
        {
            CheckPassword(password);
            Password = Hasher.HashData(password);
        }
        #endregion
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
