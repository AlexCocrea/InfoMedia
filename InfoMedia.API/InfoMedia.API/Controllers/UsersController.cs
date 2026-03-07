using InfoMedia.API.Data;
using InfoMedia.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace InfoMedia.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET /api/users/me
        [HttpGet("me")]
        public async Task<IActionResult> GetMe()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null)
                return Unauthorized("User not found in token");

            int userId = int.Parse(userIdClaim);
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
                return NotFound("User not found");

            return Ok(new
            {
                user.Id,
                user.FullName,
                user.Email,
                user.Role,
                user.Bio,
                user.AvatarUrl,
                user.CreatedAt
            });
        }

        // PUT /api/users/me
        [HttpPut("me")]
        public async Task<IActionResult> UpdateProfile([FromBody] UserProfileDTO dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized();

            int userId = int.Parse(userIdClaim);
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound();

            user.FullName = dto.FullName ?? user.FullName;
            user.Bio = dto.Bio ?? user.Bio;
            user.AvatarUrl = dto.AvatarUrl ?? user.AvatarUrl;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                user.Id,
                user.FullName,
                user.Email,
                user.Role,
                user.Bio,
                user.AvatarUrl,
                user.CreatedAt
            });
        }
    }

    // DTO
    public class UserProfileDTO
    {
        public string? FullName { get; set; }
        public string? Bio { get; set; }
        public string? AvatarUrl { get; set; }
    }
}