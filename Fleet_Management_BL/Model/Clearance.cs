using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Fleet_Management_BL.Model
{
    public class Clearance
    {
        public Clearance() { }
        public Clearance(int clearanceLevel, string description, bool isDeleted)
        {
            ClearanceLevel = clearanceLevel;
            Description = description;
            IsDeleted = isDeleted;
        }

        public Clearance(int clearanceId, int clearanceLevel, string description, bool isDeleted)
        {
            ClearanceId = clearanceId;
            ClearanceLevel = clearanceLevel;
            Description = description;
            IsDeleted = isDeleted;
        }

        public int ClearanceId { get; set; }
        public int ClearanceLevel { get; set; }
        public string Description { get; set; }
        public bool IsDeleted { get; set; }
    }
}
