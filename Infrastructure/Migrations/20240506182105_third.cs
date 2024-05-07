using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Bislerium.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class third : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "6cbb672a-7dd4-4a7b-95ff-c6ad0f847066");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "e895b75c-aa69-428c-b57d-7e8f0c79ce3f");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "8b97b1ce-2d37-42ca-a4d0-7184457113f0", "dc541c1c-aea1-48e2-b535-22c27fdc0177", "Blogger", "BLOGGER" },
                    { "ee64e5d8-0729-4973-a86b-6ef80703c972", "17b32d5e-0f59-4eca-93cf-d5093ae680a4", "Admin", "ADMIN" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "8b97b1ce-2d37-42ca-a4d0-7184457113f0");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "ee64e5d8-0729-4973-a86b-6ef80703c972");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "6cbb672a-7dd4-4a7b-95ff-c6ad0f847066", "71be6a77-b2bc-4938-b1ea-a95f47920a3e", "Admin", "ADMIN" },
                    { "e895b75c-aa69-428c-b57d-7e8f0c79ce3f", "9d52d4d7-7985-4a71-8cf6-8e50552d87cc", "Blogger", "BLOGGER" }
                });
        }
    }
}
