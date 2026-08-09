using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using backend.Models;

namespace backend.Data.Configurations;

public class TicketConfiguration : IEntityTypeConfiguration<Ticket>
{
    public void Configure(EntityTypeBuilder<Ticket> builder)
    {
        builder.HasKey(t => t.id);

        builder.HasOne(t => t.Project)
            .WithMany(p => p.Tickets)
            .HasForeignKey(t => t.project_id)
            .OnDelete(DeleteBehavior.Restrict);
    }
}