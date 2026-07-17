using Mokeb.Domain.Model.Entities;

namespace Mokeb.Application.Contracts
{
    public interface IAdminRepository
    {
        Task<Admin> GetAdminAsync(string username, string password, CancellationToken ct);
    }
}
