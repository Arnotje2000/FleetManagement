using Fleet_Management_BL.Model;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Fleet_Management_DL
{
    public class Fleet_ManagementDBContext : DbContext
    {

        public Fleet_ManagementDBContext(DbContextOptions<Fleet_ManagementDBContext> options) : base(options)
        {

        }
        // DbSets
        public DbSet<Clearance> Clearances { get; set; }
        public DbSet<CustomField> CustomFields { get; set; }
        public DbSet<CustomFieldValue> CustomFieldValues { get; set; }
        public DbSet<FuelType> FuelType { get; set; }
        public DbSet<Tenant> Tenants { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Vehicle> Vehicle { get; set; }
        public DbSet<VehicleType> VehicleTypes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Tenant>().ToTable("Tenant"); // Ensure the table name matches the database
            modelBuilder.Entity<VehicleType>().ToTable("VehicleType");
            modelBuilder.Entity<Clearance>().ToTable("Clearance");
            modelBuilder.Entity<CustomField>().ToTable("CustomField");
            modelBuilder.Entity<CustomFieldValue>().ToTable("CustomFieldValue");
            modelBuilder.Entity<FuelType>().ToTable("FuelType");
            modelBuilder.Entity<User>().ToTable("User", "dbo");
            modelBuilder.Entity<Vehicle>().ToTable("Vehicle");

            // Clearance
            modelBuilder.Entity<Clearance>().HasKey(c => c.ClearanceId);

            // CustomField
            modelBuilder.Entity<CustomField>()
                .HasKey(cf => cf.CustomFieldId);

            modelBuilder.Entity<CustomField>()
                .Property(cf => cf.ValueType)
                .HasColumnType("nvarchar(50)")
                .IsRequired();

            modelBuilder.Entity<CustomField>()
                .Property(cf => cf.FieldName)
                .HasColumnType("varchar(500)")
                .IsRequired();

            modelBuilder.Entity<CustomField>()
                .HasOne(cf => cf.Tenant)
                .WithMany(t => t.CustomFields)
                .HasForeignKey(cf => cf.TenantId)
                .OnDelete(DeleteBehavior.Restrict);

            // CustomFieldValue
            modelBuilder.Entity<CustomFieldValue>()
                .HasKey(cfv => cfv.CustomFieldValueId);

            modelBuilder.Entity<CustomFieldValue>()
                .Property(cfv => cfv.Value)
                .HasColumnType("nvarchar(max)")
                .IsRequired();

            modelBuilder.Entity<CustomFieldValue>()
                .Property(cfv => cfv.ValueType)
                .HasColumnType("nvarchar(50)")
                .IsRequired();

            modelBuilder.Entity<CustomFieldValue>()
                .HasOne(cfv => cfv.CustomField)
                .WithMany(cf => cf.CustomFieldValues)
                .HasForeignKey(cfv => cfv.CustomFieldId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<CustomFieldValue>()
                .HasOne(cfv => cfv.Vehicle)
                .WithMany(v => v.CustomFieldValues)
                .HasForeignKey(cfv => cfv.VehicleId)
                .OnDelete(DeleteBehavior.Restrict);

            // FuelType
            modelBuilder.Entity<FuelType>().HasKey(ft => ft.FuelTypeId);

            // Tenant
            modelBuilder.Entity<Tenant>()
                .HasKey(t => t.TenantId);

            modelBuilder.Entity<Tenant>()
                .HasMany(t => t.Users)
                .WithOne(u => u.Tenant)
                .HasForeignKey(u => u.TenantId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Tenant>()
                .HasMany(t => t.CustomFields)
                .WithOne(cf => cf.Tenant)
                .HasForeignKey(cf => cf.TenantId)
                .OnDelete(DeleteBehavior.Restrict);

            // User
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.UserId);
                
                entity.ToTable("User", "dbo");
                
                entity.Property(e => e.IsDeleted)
                    .HasColumnName("IsDeleted")
                    .HasDefaultValue(false);

                entity.Property(e => e.UserName)
                    .HasColumnName("UserName")
                    .IsRequired();

                entity.Property(e => e.Password)
                    .HasColumnName("Password")
                    .IsRequired();

                entity.Property(e => e.Email)
                    .HasColumnName("Email")
                    .IsRequired();

                entity.Property(e => e.TenantId)
                    .HasColumnName("TenantId")
                    .IsRequired();

                entity.Property(e => e.ClearanceId)
                    .HasColumnName("ClearanceId")
                    .IsRequired();
            });

            modelBuilder.Entity<User>()
                .HasOne(u => u.Clearance)
                .WithMany()
                .HasForeignKey(u => u.ClearanceId)
                .OnDelete(DeleteBehavior.Restrict);

            // Vehicle
            modelBuilder.Entity<Vehicle>()
                .HasKey(v => v.VehicleId);

            modelBuilder.Entity<Vehicle>()
                .HasOne(v => v.Tenant)
                .WithMany(t => t.Vehicles)
                .HasForeignKey(v => v.TenantId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Vehicle>()
                .HasOne(v => v.VehicleType)
                .WithMany(vt => vt.Vehicles)
                .HasForeignKey(v => v.VehicleTypeId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Vehicle>()
                .HasOne(v => v.Fuel)
                .WithMany(ft => ft.Vehicles)
                .HasForeignKey(v => v.FuelTypeId)
                .OnDelete(DeleteBehavior.Restrict);

            // VehicleType
            modelBuilder.Entity<VehicleType>().HasKey(vt => vt.VehicleTypeId);
        }
    }
}
