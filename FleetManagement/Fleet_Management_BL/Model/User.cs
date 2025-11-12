using System;

namespace Fleet_Management_BL.Model
{
    public class User
    {
        // Default constructor
        public User() { }

        // Constructor with parameters
        public User(Tenant tenant, string userName, string password, string email, Clearance clearance, bool isDeleted)
        {
            Tenant = tenant ?? throw new ArgumentNullException(nameof(tenant));
            UserName = userName;
            Password = password; 
            Email = email;
            Clearance = clearance ?? throw new ArgumentNullException(nameof(clearance));
            IsDeleted = isDeleted;
        }

        // Overloaded constructor with userId
        public User(int userId, Tenant tenant, string userName, string password, string email, Clearance clearance, bool isDeleted)
        {
            UserId = userId;
            Tenant = tenant ?? throw new ArgumentNullException(nameof(tenant));
            UserName = userName;
            Password = password;
            Email = email;
            Clearance = clearance ?? throw new ArgumentNullException(nameof(clearance));
            IsDeleted = isDeleted;
        }

        public int UserId { get; set; }
        public Tenant Tenant { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; } 
        public string Email { get; set; }
        public Clearance Clearance { get; set; }
        public bool IsDeleted { get; set; }
        public int TenantId { get; set; } 
        public int ClearanceId { get; set; } 

        // Method to convert DTO to User object
        public void DTOtoUser(int userId, int tenantId, string userName, string email, int clearanceId)
        {
            UserId = userId;
            Tenant = new Tenant { TenantId = tenantId };
            UserName = userName;
            Email = email;
            Clearance = new Clearance { ClearanceId = clearanceId };
        }
    }
}