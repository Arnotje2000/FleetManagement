using Fleet_Management_BL.Interface;
using Fleet_Management_BL.Model;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace Fleet_Management_DL.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly Fleet_ManagementDBContext ctx;

        public UserRepository(Fleet_ManagementDBContext _ctx)
        {
            ctx = _ctx;
        }

        public async Task DeleteUserAsync(int userId)
        {
            var user = await ctx.Users.FindAsync(userId);
            if (user == null)
            {
                throw new ArgumentException("User not found");
            }

            user.IsDeleted = true; // Mark as deleted
            await ctx.SaveChangesAsync();
        }

        public async Task<User> LogInUserAsync(string email, string password)
        {
            try
            {
                var user = await ctx.Users
                    .Include(u => u.Clearance)
                    .Include(u => u.Tenant)
                    .Where(u => u.Email == email)
                    .Select(u => new User
                    {
                        UserId = u.UserId,
                        Email = u.Email,
                        Password = u.Password,
                        UserName = u.UserName,
                        TenantId = u.TenantId,
                        ClearanceId = u.ClearanceId,
                        Tenant = new Tenant
                        {
                            TenantId = u.Tenant.TenantId,
                            CompanyName = u.Tenant.CompanyName,
                            VATNumber = u.Tenant.VATNumber,
                            IsDeleted = u.Tenant.IsDeleted
                        },
                        Clearance = new Clearance
                        {
                            ClearanceId = u.Clearance.ClearanceId,
                            ClearanceLevel = u.Clearance.ClearanceLevel,
                            Description = u.Clearance.Description
                        },
                        IsDeleted = u.IsDeleted
                    })
                    .FirstOrDefaultAsync();

                if (user != null && user.Password == password && !user.IsDeleted)
                {
                    return user;
                }
                throw new ArgumentException("email or password is incorrect");
            }
            catch (Exception ex)
            {
                throw new Exception("Error logging in: " + ex.Message);
            }
        }

        public Task LogOutUserAsync()
        {
            // Implement session management or token invalidation logic here
            throw new NotImplementedException();
        }

        public async Task<User> RegisterUserAsync(User user)
        {
            try
            {
                var existingUser = await ctx.Users.FirstOrDefaultAsync(u => u.Email == user.Email);
                if (existingUser != null)
                {
                    throw new ArgumentException("Email already exists");
                }

                // Hash the password before saving
                user.Password = HashPassword(user.Password); // Implement this method
                ctx.Users.Add(user);
                await ctx.SaveChangesAsync();
                return user;
            }
            catch (Exception ex)
            {
                throw new Exception("Error registering user: " + ex.Message);
            }
        }

        private string HashPassword(string password)
        {
            // Implement password hashing logic here (e.g., using BCrypt or another library)
            return password; // Replace with actual hashed password
        }

        private bool VerifyPassword(string inputPassword, string storedPasswordHash)
        {
            // Implement password verification logic here
            return inputPassword == storedPasswordHash; // Replace with actual verification logic
        }

        public async Task<List<User>> GetUsersByTenantIdAsync(int tenantId)
        {
            try
            {
                return await ctx.Users
                    .Where(u => u.TenantId == tenantId && !u.IsDeleted) // Adjust based on your model
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error fetching users: " + ex.Message);
            }
        }
    }
}