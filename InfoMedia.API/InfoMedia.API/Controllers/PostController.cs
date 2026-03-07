using InfoMedia.API.Data;
using InfoMedia.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace InfoMedia.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] 
    public class PostsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PostsController(ApplicationDbContext context)
        {
            _context = context;
        }
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetPosts()
        {
            var posts = await _context.Posts
                .Include(p => p.User)
                .OrderByDescending(p => p.CreatedAt)
                .Select(p => new
                {
                    p.Id,
                    p.Title,
                    p.Content,
                    Author = p.User.FullName,
                    AvatarUrl = p.User.AvatarUrl,  
                    p.CreatedAt
                })
                .ToListAsync();

            return Ok(posts);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreatePost(Post post)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null)
                return Unauthorized("User not found in token");

            post.UserId = int.Parse(userIdClaim);
            post.CreatedAt = DateTime.Now;

            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                post.Id,
                post.Title,
                post.Content,
                Author = (await _context.Users.FindAsync(post.UserId))?.FullName,
                post.CreatedAt
            });
        }

        [Authorize]
        [HttpGet("user")]
        public async Task<IActionResult> GetUserPosts()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null)
                return Unauthorized("User not found in token");

            int userId = int.Parse(userIdClaim);

            var posts = await _context.Posts
                .Where(p => p.UserId == userId)
                .OrderByDescending(p => p.CreatedAt)
                .Select(p => new
                {
                    p.Id,
                    p.Title,
                    p.Content,
                    Author = p.User.FullName,
                    AvatarUrl = p.User.AvatarUrl,  
                    p.CreatedAt
                })
                .ToListAsync();

            return Ok(posts);
        }

        [Authorize]
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserPosts(int userId)
        {
            var posts = await _context.Posts
                .Where(p => p.UserId == userId)
                .OrderByDescending(p => p.CreatedAt)
                .Select(p => new
                {
                    p.Id,
                    p.Title,
                    p.Content,
                    Author = p.User.FullName,
                    AvatarUrl = p.User.AvatarUrl, 
                    p.CreatedAt
                })
                .ToListAsync();

            return Ok(posts);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePost(int id, PostDTO dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null)
                return Unauthorized();

            int userId = int.Parse(userIdClaim);

            var post = await _context.Posts.FindAsync(id);
            if (post == null) return NotFound("Post not found");
            if (post.UserId != userId) return Forbid("You can only edit your posts");

            post.Title = dto.Title;
            post.Content = dto.Content;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                post.Id,
                post.Title,
                post.Content,
                Author = (await _context.Users.FindAsync(post.UserId))?.FullName,
                post.CreatedAt
            });
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePost(int id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null)
                return Unauthorized();

            int userId = int.Parse(userIdClaim);

            var post = await _context.Posts.FindAsync(id);
            if (post == null) return NotFound("Post not found");
            if (post.UserId != userId) return Forbid("You can only delete your posts");

            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }

    // DTO pentru postari
    public class PostDTO
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
    }
}