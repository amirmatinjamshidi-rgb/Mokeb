using Mokeb.Domain.Model.Entities;

namespace Mokeb.Application.Contracts
{
    public interface IPdfCreator
    {
        Task<byte[]> CreateIndividualReport(Request request, CancellationToken ct);
    }
}
