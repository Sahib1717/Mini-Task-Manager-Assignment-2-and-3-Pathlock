using System.ComponentModel.DataAnnotations;

namespace MiniProjectManager.Models
{
    public class User
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Username { get; set; }
        
        [Required]
        public string PasswordHash { get; set; }
        
        public ICollection<Project> Projects { get; set; } = new List<Project>();
    }
}