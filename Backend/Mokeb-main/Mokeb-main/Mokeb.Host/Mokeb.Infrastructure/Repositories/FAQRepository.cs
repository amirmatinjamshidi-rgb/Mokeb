using Microsoft.EntityFrameworkCore;
using Mokeb.Application.Contracts;
using Mokeb.Application.Dtos;
using Mokeb.Domain.Model.Entities;
using Mokeb.Infrastructure.Context;

namespace Mokeb.Infrastructure.Repositories
{
    public class FAQRepository : IFAQRepository
    {
        private readonly DbSet<FAQ> _faqs;

        public FAQRepository(MokebDbContext faqs)
        {
            _faqs = faqs.Set<FAQ>();
        }

        public void AddFaq(FAQ fAQ)
        {
            _faqs.Add(fAQ);
        }

        public async Task<List<FAQDto>> GetAllFAQsAsync(CancellationToken ct)
        {
            return await _faqs
                .Select(x => new FAQDto(x.Id, x.Question, x.Answer))
                .ToListAsync(ct);
        }

        public async Task<FAQ> GetFAQAsync(Guid faqId, CancellationToken ct)
        {
            return await _faqs
                .SingleOrDefaultAsync(x => x.Id == faqId, ct);
        }
    }
}
