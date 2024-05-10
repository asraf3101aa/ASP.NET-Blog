using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Bislerium.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class fifth : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "3ced1e96-afb1-4110-aed3-14b608d2d582");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "a1f7e5b3-9381-4d50-be64-1bf23f939e8f");

            migrationBuilder.AddColumn<int>(
                name: "NotificationFrequency",
                table: "AspNetUsers",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "NotifyComment",
                table: "AspNetUsers",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "NotifyDownvote",
                table: "AspNetUsers",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "NotifyUpvote",
                table: "AspNetUsers",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "5ff626ea-cae4-42c6-9a70-59d06908028f", "f9e8241c-3a9d-42c4-b378-9b3b8c2ed9e1", "Admin", "ADMIN" },
                    { "72579fb9-2915-4527-abc6-231a4f2e96e4", "f3addf51-83c4-4b7e-8b6c-9ae360c46624", "Blogger", "BLOGGER" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "5ff626ea-cae4-42c6-9a70-59d06908028f");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "72579fb9-2915-4527-abc6-231a4f2e96e4");

            migrationBuilder.DropColumn(
                name: "NotificationFrequency",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "NotifyComment",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "NotifyDownvote",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "NotifyUpvote",
                table: "AspNetUsers");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "3ced1e96-afb1-4110-aed3-14b608d2d582", "79977746-aa4f-471f-b053-2b541ea83d54", "Blogger", "BLOGGER" },
                    { "a1f7e5b3-9381-4d50-be64-1bf23f939e8f", "837f400b-1bc0-4549-8c68-5de86d1307d7", "Admin", "ADMIN" }
                });
        }
    }
}
