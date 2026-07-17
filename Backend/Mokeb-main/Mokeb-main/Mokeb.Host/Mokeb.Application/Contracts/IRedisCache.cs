namespace Mokeb.Application.Contracts
{
    public interface IRedisCache
    {
        Task AddToRedis(string key, string value, TimeSpan expiredTime);
        Task RemoveFromRedis(string key);
        Task<bool> CheckKeyExistanceInRedis(string key);
        Task<string> GetValueInRedis(string key);
    }
}
