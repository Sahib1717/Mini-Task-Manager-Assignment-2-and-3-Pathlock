using System.ComponentModel.DataAnnotations;

namespace MiniProjectManager.Dtos
{
    public class TaskDto
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Title { get; set; }
        
        public DateTime? DueDate { get; set; }
        
        public bool IsCompleted { get; set; }
        
        public int ProjectId { get; set; }
    }

    public class TaskCreateDto
    {
        [Required]
        [StringLength(100)]
        public string Title { get; set; }
        
        public DateTime? DueDate { get; set; }
    }

    public class TaskUpdateDto
    {
        [StringLength(100)]
        public string? Title { get; set; }
        
        public DateTime? DueDate { get; set; }
        
        public bool? IsCompleted { get; set; }
    }
}