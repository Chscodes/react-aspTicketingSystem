using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data.Seeds;

public static class ProjectSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        var projects = new[]
        {
            "SBF Project",
            "Yilujia Accounting Project",
            "MUANA HRIS Project",
            "Suntech Accounting Project",
            "Concord ERP Project",
            "MJC Accounting Project",
            "MJK HRIS Project",
        };

        foreach (var projectName in projects)
        {
            var exists = await context.Projects
                .AnyAsync(p => p.project_name == projectName);

            if (!exists)
            {
                context.Projects.Add(new Project
                {
                    project_name = projectName,
                    remarks = string.Empty,
                    isDeleted = false
                });

                Console.WriteLine($"Created Project: {projectName}");
            }
            else
            {
                Console.WriteLine($"Project already exists: {projectName}");
            }
        }

        await context.SaveChangesAsync();
    }
}