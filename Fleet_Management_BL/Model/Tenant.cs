using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Fleet_Management_BL.Model
{
    public class Tenant
    {
        public Tenant() { }
        public Tenant(string companyName, string vATNumber, bool isDeleted)
        {
            CompanyName = companyName;
            VATNumber = vATNumber;
            IsDeleted = isDeleted;
            Users = new List<User>();
        }

        public Tenant(int tenantId, string companyName, string vATNumber, bool isDeleted)
        {
            TenantId = tenantId;
            CompanyName = companyName;
            VATNumber = vATNumber;
            IsDeleted = isDeleted;
            Users = new List<User>();
        }

        public int TenantId { get; set; }
        public string CompanyName { get; set; }
        public string VATNumber { get; set; }
        public ICollection<User> Users { get; set; }
        public bool IsDeleted { get; set; }
        public ICollection<CustomField> CustomFields { get; set; } 
        public ICollection<Vehicle> Vehicles { get; set; } 
    }
}
