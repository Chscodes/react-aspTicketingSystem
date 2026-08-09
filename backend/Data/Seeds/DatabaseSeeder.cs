namespace backend.Data.Seeds;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        await ProjectSeeder.SeedAsync(context);

        // Later:
        // await TicketSeeder.SeedAsync(context);
        // await RoleSeeder.SeedAsync(context);
        // await PermissionSeeder.SeedAsync(context);
    }
}