using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace GW.Persistence.Migrations
{
    public partial class usersSeeding : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "FirstName", "Gender", "LastName", "UpdatedAt", "Username" },
                values: new object[,]
                {
                    { 1, new DateTime(2019, 7, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), "feruchio599@gmail.com", "Maverick", "Male", "Cloud", new DateTime(2019, 7, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), "Maverick" },
                    { 2, new DateTime(2019, 7, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), "saad@gmail.com", "Saad", "Male", "Salim", new DateTime(2019, 7, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), "Saad" },
                    { 3, new DateTime(2019, 7, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), "xinoredm@gmail.com", "Xinored", "Male", "Deronix", new DateTime(2019, 7, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), "Xinored" },
                    { 4, new DateTime(2019, 7, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), "badboy@gmail.com", "Badboy", "Male", "Boy", new DateTime(2019, 7, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), "Badboy" },
                    { 5, new DateTime(2019, 7, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), "roller@gmail.com", "Roller", "Male", "Rolls", new DateTime(2019, 7, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), "Mr.Roller" }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 5);
        }
    }
}
