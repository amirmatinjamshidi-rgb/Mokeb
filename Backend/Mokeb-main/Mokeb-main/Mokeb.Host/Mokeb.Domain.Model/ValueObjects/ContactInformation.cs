using Mokeb.Domain.Model.Exceptions.CaravanExceptions;
using System.Text.RegularExpressions;

namespace Mokeb.Domain.Model.ValueObjects
{
    public class ContactInformation
    {
        public ContactInformation(string gmail, string phoneNumber, string emergencyPhoneNumber)
        {
            Gmail = gmail;
            PhoneNumber = phoneNumber;
            EmergencyPhoneNumber = emergencyPhoneNumber;
        }

        public string Gmail { get; protected set; }
        public string PhoneNumber { get; protected set; }
        public string EmergencyPhoneNumber { get; protected set; }



        #region Behaviors
        public void ChangeGmail(string gmail)
        {
            CheckGmail(gmail);
            Gmail = gmail;
        }
        public void ChangePhoneNumber(string phoneNumber)
        {
            CheckPhoneNumber(phoneNumber);
            PhoneNumber = phoneNumber;
        }
        public void ChangeEmergencyPhoneNumber(string emergencyPhoneNumber)
        {
            CheckPhoneNumber(emergencyPhoneNumber);
            EmergencyPhoneNumber = emergencyPhoneNumber;
        }
        #endregion
        #region Validations

        public void CheckGmail(string gmail)
        {
            var pattern = @"^[a-zA-Z0-9._%+-]+@gmail\.com$";
            if (string.IsNullOrWhiteSpace(gmail) || !Regex.IsMatch(gmail, pattern))
            {
                throw new GmailIsInvalidException();
            }
        }
        public void CheckPhoneNumber(string phoneNumber)
        {
            var pattern = @"^09\d{9}$";
            if (string.IsNullOrWhiteSpace(phoneNumber) || !Regex.IsMatch(phoneNumber, pattern))
                throw new PhoneNumberIsInvalidException();
        }
        #endregion
    }

}
