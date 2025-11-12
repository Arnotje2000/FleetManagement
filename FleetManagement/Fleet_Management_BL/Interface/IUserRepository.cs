using Fleet_Management_BL.Model;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Fleet_Management_BL.Interface
{
    public interface IUserRepository
    {
        Task<User> LogInUserAsync(string email, string password);
        Task<User> RegisterUserAsync(User user);
        Task LogOutUserAsync(); // Define what parameters or context you need for logout
        Task DeleteUserAsync(int userId);
        Task<List<User>> GetUsersByTenantIdAsync(int tenantId); // Add this line
    }
}