using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using backend.Models;
using backend.Data.Seeds;

namespace backend.Data.Configurations;

public class ProjectConfiguration : IEntityTypeConfiguration<Project>
{
    public void Configure(EntityTypeBuilder<Project> builder)
    {
        builder.HasKey(p => p.id);
        builder.Property(p => p.isDeleted)
            .HasDefaultValue(false);

        // //seed/s
        // builder.HasData(ProjectSeed.Data);
    }
}