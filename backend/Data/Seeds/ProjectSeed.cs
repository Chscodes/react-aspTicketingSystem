using backend.Models;

namespace backend.Data.Seeds;

public static class ProjectSeed
{
    public static Project[] Data => new[]
    {
        new Project
        {
            id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
            project_name = "SBF Project",
            remarks = "",
            isDeleted = false
        },

        new Project
        {
            id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
            project_name = "Yilujia Accounting Project",
            remarks = "",
            isDeleted = false
        },

        new Project
        {
            id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
            project_name = "MUANA HRIS Project",
            remarks = "",
            isDeleted = false
        },

        new Project
        {
            id = Guid.Parse("44444444-4444-4444-4444-444444444444"),
            project_name = "Suntech Accounting Project",
            remarks = "",
            isDeleted = false
        },

        new Project
        {
            id = Guid.Parse("55555555-5555-5555-5555-555555555555"),
            project_name = "Concord ERP Project",
            remarks = "",
            isDeleted = false
        }
    };
}