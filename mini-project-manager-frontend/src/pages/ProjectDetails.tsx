import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectsAPI, tasksAPI } from '../services/api';
import { Project, Task } from '../types';
import Header from '../components/Header';
import SchedulerButton from "../components/SchedulerButton";
import { TaskInput } from "../services/scheduler";

const ProjectDetails: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

  useEffect(() => {
    if (projectId) loadProject();
  }, [projectId]);

  const loadProject = async () => {
    try {
      const response = await projectsAPI.getProject(Number(projectId));
      setProject(response.data);
    } catch (err: any) {
      setError('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await tasksAPI.createTask(Number(projectId), {
        title: newTaskTitle,
        dueDate: newTaskDueDate || undefined,
      });
      setNewTaskTitle('');
      setNewTaskDueDate('');
      setShowTaskForm(false);
      loadProject();
    } catch (err: any) {
      setError('Failed to create task');
    }
  };

  const handleToggleTask = async (task: Task) => {
    try {
      await tasksAPI.updateTask(task.id, {
        isCompleted: !task.isCompleted,
      });
      loadProject();
    } catch (err: any) {
      setError('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await tasksAPI.deleteTask(taskId);
        loadProject();
      } catch (err: any) {
        setError('Failed to delete task');
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!project) return <div>Project not found</div>;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#e6f2ff', padding: '1rem' }}>
      <Header />

      <div
        style={{
          width: '100%',
          maxWidth: '800px',
          margin: '2rem auto',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
          background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)',
          fontFamily: 'Segoe UI, sans-serif',
        }}
      >
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            marginBottom: '1rem',
            padding: '0.6rem 1rem',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#4a90e2',
            color: 'white',
            cursor: 'pointer',
            fontWeight: 600,
            width: '100%',
            maxWidth: '200px',
            transition: '0.3s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#357ABD')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#4a90e2')}
        >
          Back to Dashboard
        </button>

        <h1 style={{ marginBottom: '0.5rem', fontSize: '1.6rem' }}>{project.title}</h1>
        {project.description && <p style={{ marginBottom: '0.5rem' }}>{project.description}</p>}
        <p style={{ marginBottom: '1rem', color: '#555' }}>
          Created: {new Date(project.creationDate).toLocaleDateString()}
        </p>

        {error && (
          <div
            style={{
              color: '#ff4d4f',
              marginBottom: '1rem',
              padding: '0.8rem',
              borderRadius: '8px',
              backgroundColor: '#ffe6e6',
              textAlign: 'center',
              fontSize: '0.9rem',
            }}
          >
            {error}
          </div>
        )}

        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.3rem' }}>Tasks</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
            <button
              onClick={() => setShowTaskForm(!showTaskForm)}
              style={{
                padding: '0.6rem 1rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#4a90e2',
                color: 'white',
                fontWeight: 600,
                cursor: 'pointer',
                transition: '0.3s',
                width: '100%',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#357ABD')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#4a90e2')}
            >
              {showTaskForm ? 'Cancel' : 'Add New Task'}
            </button>

            <SchedulerButton
              projectId={Number(projectId)}
              getTasks={() =>
                (project?.tasks || []).map(t => ({
                  title: t.title,
                  estimatedHours: 0,
                  dueDate: t.dueDate,
                  dependencies: [],
                })) as TaskInput[]
              }
            />
          </div>

          {showTaskForm && (
            <form
              onSubmit={handleCreateTask}
              style={{
                marginBottom: '1rem',
                padding: '1rem',
                border: '1px solid #ccc',
                borderRadius: '8px',
              }}
            >
              <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Create New Task</h3>
              <div style={{ marginBottom: '0.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.3rem' }}>Title:</label>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ccc' }}
                />
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.3rem' }}>Due Date:</label>
                <input
                  type="date"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ccc' }}
                />
              </div>
              <button
                type="submit"
                style={{
                  padding: '0.6rem 1rem',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#4a90e2',
                  color: 'white',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: '0.3s',
                  width: '100%',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#357ABD')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#4a90e2')}
              >
                Create Task
              </button>
            </form>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {project.tasks.length === 0 ? (
              <p>No tasks yet. Add your first task!</p>
            ) : (
              project.tasks.map((task) => (
                <div
                  key={task.id}
                  style={{
                    border: '1px solid #ccc',
                    padding: '0.8rem',
                    borderRadius: '8px',
                    backgroundColor: task.isCompleted ? '#f0f0f0' : 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <input
                        type="checkbox"
                        checked={task.isCompleted}
                        onChange={() => handleToggleTask(task)}
                        style={{ marginRight: '0.5rem' }}
                      />
                      <span
                        style={{
                          textDecoration: task.isCompleted ? 'line-through' : 'none',
                          fontSize: '1rem',
                        }}
                      >
                        {task.title}
                      </span>
                      {task.dueDate && (
                        <span style={{ marginLeft: '0.5rem', color: '#666', fontSize: '0.9rem' }}>
                          (Due: {new Date(task.dueDate).toLocaleDateString()})
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      style={{
                        backgroundColor: '#ff4444',
                        color: 'white',
                        padding: '0.5rem',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer',
                        width: '100%',
                        maxWidth: '150px',
                        transition: '0.3s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#cc0000')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ff4444')}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
