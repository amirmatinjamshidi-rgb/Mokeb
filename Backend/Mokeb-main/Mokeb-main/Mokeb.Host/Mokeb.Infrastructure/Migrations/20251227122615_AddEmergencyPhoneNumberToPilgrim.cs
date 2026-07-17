using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mokeb.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddEmergencyPhoneNumberToPilgrim : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "EmergencyPhoneNumber",
                table: "Pilgrims",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EmergencyPhoneNumber",
                table: "Pilgrims");
        }
    }
}
