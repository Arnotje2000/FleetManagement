using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Fleet_Management_BL.Model;

namespace Fleet_Management_BL.DTOs
{
    public class TenantDTO
    {
        public int TenantId { get; set; }
        public string CompanyName { get; set; }
        public string VATNumber { get; set; }
        public bool IsDeleted { get; set; }
        public ICollection<User> Users { get; set; }
        public ICollection<CustomField> CustomFields { get; set; }
        public ICollection<Vehicle> Vehicles { get; set; }
    }
}