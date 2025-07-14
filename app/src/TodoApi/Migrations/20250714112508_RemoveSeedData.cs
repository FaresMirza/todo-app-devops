using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TodoApi.Migrations
{
    /// <inheritdoc />
    public partial class RemoveSeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "TodoItems",
                keyColumn: "Id",
                keyValue: 1);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "TodoItems",
                columns: new[] { "Id", "CompletedAt", "CreatedAt", "Description", "IsCompleted", "Priority", "Title", "UpdatedAt" },
                values: new object[] { 1, null, new DateTime(2025, 7, 14, 11, 22, 36, 323, DateTimeKind.Utc).AddTicks(5150), "This is a sample todo item", false, 2, "Sample Todo Item", null });
        }
    }
}
