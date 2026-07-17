using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mokeb.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class addemergencyPhoneNumberToCompanionsAndTravelers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "EmergencyPhoneNumber",
                table: "Travelers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "EmergencyPhoneNumber",
                table: "Companions",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EmergencyPhoneNumber",
                table: "Travelers");

            migrationBuilder.DropColumn(
                name: "EmergencyPhoneNumber",
                table: "Companions");
        }
    }
}
