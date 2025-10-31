using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MiniProjectManager.Backend.Controllers
{
    [Route("api/projects/{projectId}/schedule")]
    [ApiController]
    public class SchedulerController : ControllerBase
    {
        [HttpPost]
        public IActionResult ScheduleTasks([FromBody] ScheduleRequest request)
        {
            if (request == null || request.Tasks == null || request.Tasks.Count == 0)
                return BadRequest("No tasks provided");

            try
            {
                var tasks = request.Tasks;
                var scheduled = ScheduleTasksInternal(tasks);
                return Ok(new ScheduleResponse
                {
                    ProjectId = request.ProjectId,
                    RecommendedOrder = scheduled.Select(t => t.Title).ToList()
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error scheduling tasks", error = ex.Message });
            }
        }

        private List<TaskInput> ScheduleTasksInternal(List<TaskInput> tasks)
        {
            // Topological sort based on dependencies
            var result = new List<TaskInput>();
            var taskDict = tasks.ToDictionary(t => t.Title, t => t);
            var visited = new HashSet<string>();

            void Visit(TaskInput task)
            {
                if (visited.Contains(task.Title)) return;
                foreach (var dep in task.Dependencies)
                {
                    if (taskDict.ContainsKey(dep))
                        Visit(taskDict[dep]);
                }
                visited.Add(task.Title);
                result.Add(task);
            }

            foreach (var t in tasks)
                Visit(t);

            // Sort by due date if available
            result = result.OrderBy(t => t.DueDate ?? DateTime.MaxValue).ToList();
            return result;
        }
    }

    // --- Models ---
    public class ScheduleRequest
    {
        public int ProjectId { get; set; }
        public List<TaskInput> Tasks { get; set; }
    }

    public class TaskInput
    {
        public string Title { get; set; }
        public double EstimatedHours { get; set; }
        public DateTime? DueDate { get; set; }
        public List<string> Dependencies { get; set; } = new();
    }

    public class ScheduleResponse
    {
        public int ProjectId { get; set; }
        public List<string> RecommendedOrder { get; set; }
    }
}
