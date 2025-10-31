using System.ComponentModel.DataAnnotations;

namespace MiniProjectManager.Dtos
{
    public class ProjectDto
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(100, MinimumLength = 3)]
        public string Title { get; set; }
        
        [StringLength(500)]
        public string? Description { get; set; }
        
        public DateTime CreationDate { get; set; }
        
        public int UserId { get; set; }
        
        public List<TaskDto> Tasks { get; set; } = new();
    }

    public class ProjectCreateDto
    {
        [Required]
        [StringLength(100, MinimumLength = 3)]
        public string Title { get; set; }
        
        [StringLength(500)]
        public string? Description { get; set; }
    }
}