using System.ComponentModel.DataAnnotations;

namespace MiniProjectManager.Dtos
{
    public class UserRegisterDto
    {
        [Required]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }
    }
}