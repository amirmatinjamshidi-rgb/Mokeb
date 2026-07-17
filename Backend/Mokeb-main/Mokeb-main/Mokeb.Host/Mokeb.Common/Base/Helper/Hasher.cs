using System.Security.Cryptography;
using System.Text;

namespace Mokeb.Common.Base.Helper
{
    public class Hasher
    {
        public static string HashData(string data)
        {
            var dataBytes = MD5.HashData(Encoding.UTF8.GetBytes(data));
            return Convert.ToHexString(dataBytes);
        }
    }
}
