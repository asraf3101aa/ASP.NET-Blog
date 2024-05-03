using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Bislerium.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class second : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "7f624d18-d514-4deb-a5b8-be010be00766");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "fa4b4c83-5d4c-481f-83d5-7a3137af081e");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Reactions");

            migrationBuilder.DropColumn(
                name: "Discriminator",
                table: "AspNetUsers");

            migrationBuilder.AlterColumn<string>(
                name: "FirstName",
                table: "AspNetUsers",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "6cbb672a-7dd4-4a7b-95ff-c6ad0f847066", "71be6a77-b2bc-4938-b1ea-a95f47920a3e", "Admin", "ADMIN" },
                    { "e895b75c-aa69-428c-b57d-7e8f0c79ce3f", "9d52d4d7-7985-4a71-8cf6-8e50552d87cc", "Blogger", "BLOGGER" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "6cbb672a-7dd4-4a7b-95ff-c6ad0f847066");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "e895b75c-aa69-428c-b57d-7e8f0c79ce3f");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Reactions",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AlterColumn<string>(
                name: "FirstName",
                table: "AspNetUsers",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<string>(
                name: "Discriminator",
                table: "AspNetUsers",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "7f624d18-d514-4deb-a5b8-be010be00766", "aae8b138-e1c7-43fa-a224-50bedf192ddd", "Blogger", "BLOGGER" },
                    { "fa4b4c83-5d4c-481f-83d5-7a3137af081e", "c05f2de8-f1d4-446d-9759-cf22da219ea5", "Admin", "ADMIN" }
                });
        }
    }
}
