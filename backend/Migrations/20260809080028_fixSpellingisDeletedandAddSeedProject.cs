using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class fixSpellingisDeletedandAddSeedProject : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IsDeleted",
                table: "Projects",
                newName: "isDeleted");

            migrationBuilder.AlterColumn<bool>(
                name: "isDeleted",
                table: "Projects",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "tinyint(1)");

            migrationBuilder.InsertData(
                table: "Projects",
                columns: new[] { "id", "project_name", "remarks" },
                values: new object[,]
                {
                    { new Guid("11111111-1111-1111-1111-111111111111"), "SBF Project", "" },
                    { new Guid("22222222-2222-2222-2222-222222222222"), "Yilujia Accounting Project", "" },
                    { new Guid("33333333-3333-3333-3333-333333333333"), "MUANA HRIS Project", "" },
                    { new Guid("44444444-4444-4444-4444-444444444444"), "Suntech Accounting Project", "" },
                    { new Guid("55555555-5555-5555-5555-555555555555"), "Concord ERP Project", "" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Projects",
                keyColumn: "id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"));

            migrationBuilder.DeleteData(
                table: "Projects",
                keyColumn: "id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222222"));

            migrationBuilder.DeleteData(
                table: "Projects",
                keyColumn: "id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333333"));

            migrationBuilder.DeleteData(
                table: "Projects",
                keyColumn: "id",
                keyValue: new Guid("44444444-4444-4444-4444-444444444444"));

            migrationBuilder.DeleteData(
                table: "Projects",
                keyColumn: "id",
                keyValue: new Guid("55555555-5555-5555-5555-555555555555"));

            migrationBuilder.RenameColumn(
                name: "isDeleted",
                table: "Projects",
                newName: "IsDeleted");

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                table: "Projects",
                type: "tinyint(1)",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "tinyint(1)",
                oldDefaultValue: false);
        }
    }
}
