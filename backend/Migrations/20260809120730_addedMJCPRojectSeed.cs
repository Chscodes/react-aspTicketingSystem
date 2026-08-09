using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class addedMJCPRojectSeed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Projects",
                columns: new[] { "id", "project_name", "remarks" },
                values: new object[] { new Guid("66666666-6666-6666-6666-666666666666"), "MJC Accounting Project", "" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Projects",
                keyColumn: "id",
                keyValue: new Guid("66666666-6666-6666-6666-666666666666"));
        }
    }
}
