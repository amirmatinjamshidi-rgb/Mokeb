using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mokeb.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialDb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CaravanPrincipals",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    FamilyName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    NationalCode = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    PassportNumber = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    DateOfBirth = table.Column<DateOnly>(type: "date", nullable: false),
                    Gender = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ContactInformation_Gmail = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    ContactInformation_PhoneNumber = table.Column<string>(type: "nvarchar(11)", maxLength: 11, nullable: false),
                    ContactInformation_EmergencyPhoneNumber = table.Column<string>(type: "nvarchar(11)", maxLength: 11, nullable: false),
                    IdentityInformation_Username = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    IdentityInformation_Password = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    IdentityInformation_Role = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IdentityInformation_BloodType = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CaravanPrincipals", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "FAQs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Question = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Answer = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FAQs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Galleries",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FilePath = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Detail = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    AdminUsername = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Galleries", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "IndividualPrincipals",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    FamilyName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    NationalCode = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    PassportNumber = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    DateOfBirth = table.Column<DateOnly>(type: "date", nullable: false),
                    Gender = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ContactInformation_Gmail = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    ContactInformation_PhoneNumber = table.Column<string>(type: "nvarchar(11)", maxLength: 11, nullable: false),
                    ContactInformation_EmergencyPhoneNumber = table.Column<string>(type: "nvarchar(11)", maxLength: 11, nullable: false),
                    IdentityInformation_Username = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    IdentityInformation_Password = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    IdentityInformation_Role = table.Column<int>(type: "int", nullable: false),
                    IdentityInformation_BloodType = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IndividualPrincipals", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Rooms",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Gender = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Capacity = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rooms", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Pilgrims",
                columns: table => new
                {
                    CaravanPrincipalId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    FamilyName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    NationalCode = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    PassportNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DateOfBirth = table.Column<DateOnly>(type: "date", nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(11)", maxLength: 11, nullable: false),
                    Gender = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pilgrims", x => new { x.CaravanPrincipalId, x.Id });
                    table.ForeignKey(
                        name: "FK_Pilgrims_CaravanPrincipals_CaravanPrincipalId",
                        column: x => x.CaravanPrincipalId,
                        principalTable: "CaravanPrincipals",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Companions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    FamilyName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    NationalCode = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    PassportNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DateOfBirth = table.Column<DateOnly>(type: "date", nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(11)", maxLength: 11, nullable: false),
                    Gender = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PrincipalId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Companions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Companions_IndividualPrincipals_PrincipalId",
                        column: x => x.PrincipalId,
                        principalTable: "IndividualPrincipals",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Requests",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MaleCount = table.Column<long>(type: "bigint", nullable: false),
                    FemaleCount = table.Column<long>(type: "bigint", nullable: false),
                    EnterTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ExitTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    State = table.Column<int>(type: "int", nullable: false),
                    DateOfAcceptingRequest = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CaravanPrincipalId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    IndividualPrincipalId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Requests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Requests_CaravanPrincipals_CaravanPrincipalId",
                        column: x => x.CaravanPrincipalId,
                        principalTable: "CaravanPrincipals",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Requests_IndividualPrincipals_IndividualPrincipalId",
                        column: x => x.IndividualPrincipalId,
                        principalTable: "IndividualPrincipals",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "RoomAvailability",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AvailableDay = table.Column<DateOnly>(type: "date", nullable: false),
                    AvailableCapacity = table.Column<long>(type: "bigint", nullable: false),
                    RoomId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoomAvailability", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RoomAvailability_Rooms_RoomId",
                        column: x => x.RoomId,
                        principalTable: "Rooms",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RequestRoom",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RequestId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RequestRoom", x => new { x.RequestId, x.Id });
                    table.ForeignKey(
                        name: "FK_RequestRoom_Requests_RequestId",
                        column: x => x.RequestId,
                        principalTable: "Requests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Travelers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    FamilyName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    NationalCode = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    PassportNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DateOfBirth = table.Column<DateOnly>(type: "date", nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(11)", maxLength: 11, nullable: false),
                    Gender = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RequestId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Travelers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Travelers_Requests_RequestId",
                        column: x => x.RequestId,
                        principalTable: "Requests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Companions_PrincipalId",
                table: "Companions",
                column: "PrincipalId");

            migrationBuilder.CreateIndex(
                name: "IX_Requests_CaravanPrincipalId",
                table: "Requests",
                column: "CaravanPrincipalId");

            migrationBuilder.CreateIndex(
                name: "IX_Requests_IndividualPrincipalId",
                table: "Requests",
                column: "IndividualPrincipalId");

            migrationBuilder.CreateIndex(
                name: "IX_RoomAvailability_RoomId",
                table: "RoomAvailability",
                column: "RoomId");

            migrationBuilder.CreateIndex(
                name: "IX_Travelers_RequestId",
                table: "Travelers",
                column: "RequestId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Companions");

            migrationBuilder.DropTable(
                name: "FAQs");

            migrationBuilder.DropTable(
                name: "Galleries");

            migrationBuilder.DropTable(
                name: "Pilgrims");

            migrationBuilder.DropTable(
                name: "RequestRoom");

            migrationBuilder.DropTable(
                name: "RoomAvailability");

            migrationBuilder.DropTable(
                name: "Travelers");

            migrationBuilder.DropTable(
                name: "Rooms");

            migrationBuilder.DropTable(
                name: "Requests");

            migrationBuilder.DropTable(
                name: "CaravanPrincipals");

            migrationBuilder.DropTable(
                name: "IndividualPrincipals");
        }
    }
}
