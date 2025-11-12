using Fleet_Management_BL.DTOs;
using Fleet_Management_BL.Interface;
using Fleet_Management_BL.Model;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;

namespace REST.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _repo;
        public UserController(IUserRepository repo)
        {
            _repo = repo;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDTO>> LoginUser([FromBody] LoginDTO loginRequest)
        {
            // Validate the request
            if (loginRequest == null || string.IsNullOrEmpty(loginRequest.Email) || string.IsNullOrEmpty(loginRequest.Password))
            {
                return BadRequest("Email and password are required.");
            }

            // Query the database for the user
            var user = await _repo.LogInUserAsync(loginRequest.Email, loginRequest.Password);
            if (user == null)
            {
                return Unauthorized("Invalid email or password.");
            }

            // Ensure Clearance is not null
            if (user.Clearance == null)
            {
                return BadRequest("User clearance information is missing.");
            }

            // Create and return the UserDTO
            UserDTO userDTO = new UserDTO(user.UserId, user.TenantId, user.UserName, user.Email, user.Clearance.ClearanceId);
            return Ok(new { success = true, user = userDTO });
        }


        [HttpPost("register")]
        public async Task<ActionResult<UserDTO>> RegisterUser([FromBody] RegisterDTO registerRequest)
        {
            try
            {
                if (registerRequest == null || string.IsNullOrEmpty(registerRequest.Email) || string.IsNullOrEmpty(registerRequest.Password))
                {
                    return BadRequest("Email and password are required.");
                }

                // Create user to be sent to the database
                User usr = new()
                {
                    Email = registerRequest.Email,
                    Password = registerRequest.Password,
                    UserName = "",
                    Clearance = new Clearance(1, "", false),
                    Tenant = new Tenant(0, "", "", false)
                };

                // User is passed and saved in the database
                var user = await _repo.RegisterUserAsync(usr);
                UserDTO userDTO = new UserDTO(user.UserId, user.TenantId, user.UserName, user.Email, user.Clearance.ClearanceId);
                return Ok(userDTO);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Get all users for a specific tenant
        [HttpGet("users")]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers(int tenantId)
        {
            try
            {
                var users = await _repo.GetUsersByTenantIdAsync(tenantId); // Implement this method in your repository
                return Ok(users);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return BadRequest("Something went wrong in the database");
            }
        }

        [HttpDelete("users/{userId}")]
        public async Task<IActionResult> DeleteUser(int userId)
        {
            try
            {
                // Attempt to delete the user
                await _repo.DeleteUserAsync(userId);
                return Ok($"User with ID {userId} deleted successfully.");
            }
            catch (ArgumentException ex)
            {
                // User not found
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                // Log the exception for debugging
                Console.WriteLine(ex);
                return StatusCode(500, "An error occurred while deleting the user. Please try again later.");
            }
        }
    }
}
