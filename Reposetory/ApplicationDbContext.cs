//using System.Collections.Generic;
//using System.Reflection.Emit;
using Microsoft.EntityFrameworkCore;
namespace Reposetories
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // טבלאות
        public DbSet<Category> Categories { get; set; }
        public DbSet<Product> Products { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // הגדרת טבלת Categories
            modelBuilder.Entity<Category>(entity =>
            {
                entity.ToTable("Categories");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Image).IsRequired().HasMaxLength(10);
            });

            // הגדרת טבלת Products
            modelBuilder.Entity<Product>(entity =>
            {
                entity.ToTable("Products");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                entity.Property(e => e.CategoryId).IsRequired();
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Image).IsRequired().HasMaxLength(10);

                // ✔ יצירת קשר תקין לקטגוריה (תיקון: חיבור נכון של הניווטים)
                entity.HasOne(e => e.Category)
                      .WithMany(c => c.Products)
                      .HasForeignKey(e => e.CategoryId)
                      .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
