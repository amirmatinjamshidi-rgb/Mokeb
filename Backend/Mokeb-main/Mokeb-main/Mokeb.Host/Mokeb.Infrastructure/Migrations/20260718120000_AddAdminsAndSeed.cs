using System;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Mokeb.Infrastructure.Context;

#nullable disable

namespace Mokeb.Infrastructure.Migrations
{
    [DbContext(typeof(MokebDbContext))]
    [Migration("20260718120000_AddAdminsAndSeed")]
    public partial class AddAdminsAndSeed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Admins",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Username = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Password = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Admins", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Admins_Username",
                table: "Admins",
                column: "Username",
                unique: true);

            // MD5("admin") = 21232F297A57A5A743894A0E4A801FC3
            migrationBuilder.InsertData(
                table: "Admins",
                columns: new[] { "Id", "Username", "Password" },
                values: new object[]
                {
                    new Guid("11111111-1111-1111-1111-111111111111"),
                    "admin",
                    "21232F297A57A5A743894A0E4A801FC3"
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Admins");
        }
    }
}
