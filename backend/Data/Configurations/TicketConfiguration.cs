using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using backend.Models;
using backend.Models.Enumerations;

namespace backend.Data.Configurations;

public class TicketConfiguration : IEntityTypeConfiguration<Ticket>
{
    public void Configure(EntityTypeBuilder<Ticket> builder)
    {
        // Primary Key
        builder.HasKey(t => t.id);

        // Is Deleted
        builder.Property(t => t.isDeleted)
            .HasDefaultValue(false);

        // Status
        builder.Property(t => t.status)
            .HasDefaultValue(TicketStatus.New);

        // Unique Reference Number
        builder.HasIndex(t => new
        {
            t.project_id,
            t.reference_no
        })
        .IsUnique();

         // Created At
        builder.Property(t => t.createdAt)
            .HasColumnType("datetime(6)");

        // Updated At
        builder.Property(t => t.updatedAt)
            .HasColumnType("datetime(6)");

        // Project Relationship
        builder.HasOne(t => t.Project)
            .WithMany(p => p.Tickets)
            .HasForeignKey(t => t.project_id)
            .OnDelete(DeleteBehavior.Restrict);
    }
}