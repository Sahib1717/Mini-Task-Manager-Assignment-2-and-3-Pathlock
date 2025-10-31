
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { projectsAPI } from '../services/api';
import { Project } from '../types';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');

  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await projectsAPI.getProjects();
      setProjects(response.data);
    } catch (err: any) {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await projectsAPI.createProject({
        title: newProjectTitle,
        description: newProjectDescription,
      });
      setNewProjectTitle('');
      setNewProjectDescription('');
      setShowCreateForm(false);
      loadProjects();
    } catch (err: any) {
      setError('Failed to create project');
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectsAPI.deleteProject(id);
        loadProjects();
      } catch (err: any) {
        setError('Failed to delete project');
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#e6f2ff',
        padding: '1rem',
        fontFamily: 'Segoe UI, sans-serif',
      }}
    >
      <Header />

      <div
        style={{
          width: '100%',
          maxWidth: '800px',
          margin: '2rem auto',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
          background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)',
        }}
      >
        {/* Dashboard title + Logout */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '1.5rem',
          }}
        >
          <h1 style={{ fontSize: '1.8rem', margin: 0 }}>My Projects</h1>
          <button
            onClick={handleLogout}
            style={{
              padding: '0.6rem 1.2rem',
              backgroundColor: '#ff4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              transition: '0.3s',
              alignSelf: 'flex-start',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#cc0000')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ff4444')}
          >
            Logout
          </button>
        </div>

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

        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          style={{
            marginBottom: '1.5rem',
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
          {showCreateForm ? 'Cancel' : 'Create New Project'}
        </button>

        {showCreateForm && (
          <form
            onSubmit={handleCreateProject}
            style={{
              marginBottom: '1.5rem',
              padding: '1rem',
              border: '1px solid #ccc',
              borderRadius: '8px',
              width: '100%',
            }}
          >
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.8rem' }}>Create New Project</h3>
            <div style={{ marginBottom: '0.8rem' }}>
              <label style={{ display: 'block', marginBottom: '0.3rem' }}>Title:</label>
              <input
                type="text"
                value={newProjectTitle}
                onChange={(e) => setNewProjectTitle(e.target.value)}
                required
                minLength={3}
                maxLength={100}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ marginBottom: '0.8rem' }}>
              <label style={{ display: 'block', marginBottom: '0.3rem' }}>Description:</label>
              <textarea
                value={newProjectDescription}
                onChange={(e) => setNewProjectDescription(e.target.value)}
                maxLength={500}
                style={{
                  width: '100%',
                  padding: '0.6rem',
                  minHeight: '100px',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                }}
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
              Create Project
            </button>
          </form>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {projects.length === 0 ? (
            <p style={{ textAlign: 'center' }}>No projects found. Create your first project!</p>
          ) : (
            projects.map((project) => (
              <div
                key={project.id}
                style={{
                  border: '1px solid #ccc',
                  padding: '1rem',
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{project.title}</h3>
                <p style={{ margin: 0 }}>{project.description}</p>
                <p style={{ color: '#555', margin: 0 }}>
                  Created: {new Date(project.creationDate).toLocaleDateString()}
                </p>
                <p style={{ color: '#555', margin: 0 }}>Tasks: {project.tasks.length}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <Link to={`/project/${project.id}`} style={{ flex: '1 1 auto' }}>
                    <button
                      style={{
                        padding: '0.5rem',
                        cursor: 'pointer',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: '#4a90e2',
                        color: 'white',
                        fontWeight: 600,
                        width: '100%',
                        transition: '0.3s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#357ABD')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#4a90e2')}
                    >
                      View Details
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    style={{
                      backgroundColor: '#ff4444',
                      color: 'white',
                      padding: '0.5rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      border: 'none',
                      flex: '1 1 auto',
                      width: '100%',
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
  );
};

export default Dashboard;
