using Mokeb.Application.Dtos;
using Mokeb.Domain.Model.Entities;

namespace Mokeb.Application.Contracts
{
    public interface IFAQRepository
    {
        void AddFaq(FAQ fAQ);
        Task<List<FAQDto>> GetAllFAQsAsync(CancellationToken ct);
        Task<FAQ> GetFAQAsync(Guid faqId, CancellationToken ct);
    }
}
