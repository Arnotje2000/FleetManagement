using Fleet_Management_BL.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Fleet_Management_BL.DTOs
{
    public class UserDTO
    {
        public UserDTO() { }

        public UserDTO(int userId, int tenantId, string userName, string email, int clearanceId)
        {
            UserId = userId;
            TenantId = tenantId;
            UserName = userName;
            Email = email;
            ClearanceId = clearanceId;
        }

        public int UserId { get; set; } // nog checken of userId nodig blijft in de app
        public int TenantId { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public int ClearanceId { get; set; }
    }
}
