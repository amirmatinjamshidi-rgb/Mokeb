using Microsoft.EntityFrameworkCore;
using Mokeb.Application.Contracts;
using Mokeb.Domain.Model.Entities;
using Mokeb.Infrastructure.Context;
using static Mokeb.Application.Contracts.IUnitOfWork;

namespace Mokeb.Infrastructure.unitOfWork
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly MokebDbContext _context;

        public UnitOfWork(MokebDbContext context)
        {
            _context = context;
        }

        public List<RoomAvailability> ChangedRoomAvailabilities()
        {
            var changedRoomAvailabilities = new List<RoomAvailability>();
            var entries = _context.ChangeTracker.Entries().Where(x => x.Entity is RoomAvailability && x.State == EntityState.Modified).ToList();
            foreach (var entry in entries)
            {
                var room = entry.Entity as RoomAvailability;
                changedRoomAvailabilities.Add(room);
            }
            return changedRoomAvailabilities;

        }

        public async Task<SavingResult> Commit(CancellationToken ct)
        {
            var savedChangedStateCount = await _context.SaveChangesAsync(ct);
            return new SavingResult { ChangesCount = savedChangedStateCount };
        }
    }
}
