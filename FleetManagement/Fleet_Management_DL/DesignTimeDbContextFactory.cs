using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Fleet_Management_DL
{
    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<Fleet_ManagementDBContext>
    {
        public Fleet_ManagementDBContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<Fleet_ManagementDBContext>();
            optionsBuilder.UseSqlServer(@"Data Source=PCBRAM\SQLEXPRESS;Initial Catalog=FleetManagerDB;Integrated Security=True;Encrypt=False;Trust Server Certificate=True");

            return new Fleet_ManagementDBContext(optionsBuilder.Options);
        }
    }
} 