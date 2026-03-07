using System;

namespace InfoMedia.API.Models
{
    public class User
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Role { get; set; } = "Student";
        public DateTime CreatedAt { get; set; }
        public string AvatarUrl { get; set; } = "C:/Users/User/Desktop/InfoMedia/infomedia-react/infomedia-react/src/assets/simple-user-default-icon-free-png";

        public string Bio { get; set; } = "";
    }
}
