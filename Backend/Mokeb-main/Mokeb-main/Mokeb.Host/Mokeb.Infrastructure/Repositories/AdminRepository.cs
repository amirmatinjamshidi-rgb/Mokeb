using Microsoft.EntityFrameworkCore;
using Mokeb.Application.Contracts;
using Mokeb.Domain.Model.Entities;
using Mokeb.Infrastructure.Context;

namespace Mokeb.Infrastructure.Repositories
{
    public class AdminRepository : IAdminRepository
    {
        private readonly DbSet<Admin> _admin;

        public AdminRepository(MokebDbContext admin)
        {
            _admin = admin.Set<Admin>();
        }

        public async Task<Admin> GetAdminAsync(string username, string password, CancellationToken ct)
        {
            return await _admin.SingleOrDefaultAsync(x => x.Username == username && x.Password == password, ct);
        }
    }
}
