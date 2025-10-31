using System.ComponentModel.DataAnnotations;

namespace MiniProjectManager.Models
{
    public class ProjectTask
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Title { get; set; }
        
        public DateTime? DueDate { get; set; }
        
        public bool IsCompleted { get; set; } = false;
        
        public int ProjectId { get; set; }
        public Project Project { get; set; }
    }
}