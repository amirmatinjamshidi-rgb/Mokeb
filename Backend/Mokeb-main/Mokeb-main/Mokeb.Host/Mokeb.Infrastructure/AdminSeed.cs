using Microsoft.EntityFrameworkCore;
using Mokeb.Common.Base.Helper;
using Mokeb.Infrastructure.Configuration;
using Mokeb.Infrastructure.Context;

namespace Mokeb.Infrastructure
{
    /// <summary>
    /// Ensures Admins table + default admin/admin exist even if migrations were not applied.
    /// </summary>
    public static class AdminSeed
    {
        public static async Task EnsureAsync(MokebDbContext db, CancellationToken ct = default)
        {
            await db.Database.ExecuteSqlRawAsync("""
                IF OBJECT_ID(N'dbo.Admins', N'U') IS NULL
                BEGIN
                    CREATE TABLE [dbo].[Admins] (
                        [Id] uniqueidentifier NOT NULL,
                        [Username] nvarchar(100) NOT NULL,
                        [Password] nvarchar(64) NOT NULL,
                        CONSTRAINT [PK_Admins] PRIMARY KEY ([Id])
                    );
                    CREATE UNIQUE INDEX [IX_Admins_Username] ON [dbo].[Admins] ([Username]);
                END
                """, ct);

            var hash = Hasher.HashData("admin");
            var id = AdminConfiguration.DefaultAdminId;

            await db.Database.ExecuteSqlRawAsync(
                """
                IF NOT EXISTS (SELECT 1 FROM [dbo].[Admins] WHERE [Username] = N'admin')
                BEGIN
                    INSERT INTO [dbo].[Admins] ([Id], [Username], [Password])
                    VALUES ({0}, N'admin', {1});
                END
                """,
                new object[] { id, hash },
                ct);
        }
    }
}
