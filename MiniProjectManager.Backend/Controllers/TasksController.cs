using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiniProjectManager.Data;
using MiniProjectManager.Dtos;
using MiniProjectManager.Models;
using MiniProjectManager.Services;

namespace MiniProjectManager.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IAuthService _authService;

        public TasksController(ApplicationDbContext context, IAuthService authService)
        {
            _context = context;
            _authService = authService;
        }

        [HttpPost("projects/{projectId}/tasks")]
        public async Task<ActionResult<TaskDto>> CreateTask(int projectId, TaskCreateDto taskCreateDto)
        {
            var user = await GetCurrentUser();
            var project = await _context.Projects.FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == user.Id);
            
            if (project == null)
                return NotFound("Project not found");

            var task = new ProjectTask
            {
                Title = taskCreateDto.Title,
                DueDate = taskCreateDto.DueDate,
                ProjectId = projectId
            };

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            var taskDto = new TaskDto
            {
                Id = task.Id,
                Title = task.Title,
                DueDate = task.DueDate,
                IsCompleted = task.IsCompleted,
                ProjectId = task.ProjectId
            };

            return CreatedAtAction(nameof(GetTask), new { taskId = task.Id }, taskDto);
        }

        [HttpPut("{taskId}")]
        public async Task<ActionResult<TaskDto>> UpdateTask(int taskId, TaskUpdateDto taskUpdateDto)
        {
            var user = await GetCurrentUser();
            var task = await _context.Tasks
                .Include(t => t.Project)
                .FirstOrDefaultAsync(t => t.Id == taskId && t.Project.UserId == user.Id);

            if (task == null)
                return NotFound();

            if (taskUpdateDto.Title != null)
                task.Title = taskUpdateDto.Title;
            
            if (taskUpdateDto.DueDate.HasValue)
                task.DueDate = taskUpdateDto.DueDate;
            
            if (taskUpdateDto.IsCompleted.HasValue)
                task.IsCompleted = taskUpdateDto.IsCompleted.Value;

            await _context.SaveChangesAsync();

            var taskDto = new TaskDto
            {
                Id = task.Id,
                Title = task.Title,
                DueDate = task.DueDate,
                IsCompleted = task.IsCompleted,
                ProjectId = task.ProjectId
            };

            return taskDto;
        }

        [HttpDelete("{taskId}")]
        public async Task<IActionResult> DeleteTask(int taskId)
        {
            var user = await GetCurrentUser();
            var task = await _context.Tasks
                .Include(t => t.Project)
                .FirstOrDefaultAsync(t => t.Id == taskId && t.Project.UserId == user.Id);

            if (task == null)
                return NotFound();

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("{taskId}")]
        public async Task<ActionResult<TaskDto>> GetTask(int taskId)
        {
            var user = await GetCurrentUser();
            var task = await _context.Tasks
                .Include(t => t.Project)
                .Where(t => t.Id == taskId && t.Project.UserId == user.Id)
                .Select(t => new TaskDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    DueDate = t.DueDate,
                    IsCompleted = t.IsCompleted,
                    ProjectId = t.ProjectId
                })
                .FirstOrDefaultAsync();

            if (task == null)
                return NotFound();

            return task;
        }

        private async Task<User> GetCurrentUser()
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            var user = await _authService.GetUserFromToken(token);
            if (user == null)
                throw new Exception("User not found");

            return user;
        }
    }
}