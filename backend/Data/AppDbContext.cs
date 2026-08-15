// appDbContext.cs
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.Models.Base;
namespace backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Project> Projects { get; set; }
        public DbSet<Ticket> Tickets { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(
                typeof(AppDbContext).Assembly
            );

            base.OnModelCreating(modelBuilder);
        }

        public override int SaveChanges()
        {
            UpdateTimestamps();

            return base.SaveChanges();
        }

        public override Task<int> SaveChangesAsync(
            CancellationToken cancellationToken = default)
        {
            UpdateTimestamps();

            return base.SaveChangesAsync(cancellationToken);
        }

      private void UpdateTimestamps()
        {
            var entries = ChangeTracker
                .Entries<BaseEntity>();

            foreach (var entry in entries)
            {
                if (entry.State == EntityState.Added)
                {
                    var now = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(
                        DateTime.UtcNow,
                        "Singapore Standard Time"
                    );

                    entry.Entity.createdAt = now;
                    entry.Entity.updatedAt = now;
                }

                if (entry.State == EntityState.Modified)
                {
                    var now = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(
                        DateTime.UtcNow,
                        "Singapore Standard Time"
                    );

                    entry.Entity.updatedAt = now;

                    entry.Property(e => e.createdAt).IsModified = false;
                }
            }
        }
    }
}