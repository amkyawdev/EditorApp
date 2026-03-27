document.addEventListener('DOMContentLoaded', () => {
    const projectsGrid = document.getElementById('projects-grid');
    const newProjectBtn = document.getElementById('new-project-btn');
    const projectModal = document.getElementById('project-modal');
    const closeModal = document.querySelector('.close');
    const newProjectForm = document.getElementById('new-project-form');

    // Load projects (expects array of { id, name })
    async function loadProjects() {
        try {
            const response = await fetch('/api/projects');
            const projects = await response.json();
            
            projectsGrid.innerHTML = '';
            
            if (projects.length === 0) {
                projectsGrid.innerHTML = '<p class="no-projects">No projects found. Create one to get started!</p>';
                return;
            }

            projects.forEach(project => {
                const card = document.createElement('div');
                card.className = 'project-card fade-in';
                card.innerHTML = `
                    <h3>${escapeHtml(project.name)}</h3>
                    <div class="project-actions">
                        <button class="btn btn-primary open-btn" data-id="${project.id}" data-name="${escapeHtml(project.name)}">Open</button>
                        <button class="btn btn-danger delete-btn" data-id="${project.id}" data-name="${escapeHtml(project.name)}">Delete</button>
                    </div>
                `;
                projectsGrid.appendChild(card);
            });

            // Add event listeners to buttons
            document.querySelectorAll('.open-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const projectId = e.target.getAttribute('data-id');
                    // Pass project_id to editing page via URL parameter
                    window.location.href = `/editing?project_id=${projectId}`;
                });
            });

            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const projectId = e.target.getAttribute('data-id');
                    const projectName = e.target.getAttribute('data-name');
                    if (confirm(`Are you sure you want to delete project "${projectName}"?`)) {
                        const response = await fetch(`/api/projects/${projectId}`, { method: 'DELETE' });
                        if (response.ok) {
                            loadProjects();
                        } else {
                            const err = await response.json();
                            alert(err.error || 'Failed to delete project');
                        }
                    }
                });
            });

        } catch (error) {
            console.error('Error loading projects:', error);
            projectsGrid.innerHTML = '<p class="error">Failed to load projects.</p>';
        }
    }

    // Modal logic
    newProjectBtn.onclick = () => projectModal.style.display = 'block';
    closeModal.onclick = () => projectModal.style.display = 'none';
    window.onclick = (event) => {
        if (event.target == projectModal) projectModal.style.display = 'none';
    };

    // Create project (with default index.html)
    newProjectForm.onsubmit = async (e) => {
        e.preventDefault();
        const name = document.getElementById('project-name').value.trim();
        if (!name) return;

        try {
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name })
            });
            
            if (response.ok) {
                const newProject = await response.json(); // expected { id, name }
                projectModal.style.display = 'none';
                newProjectForm.reset();
                loadProjects();
            } else {
                const data = await response.json();
                alert(data.error || 'Failed to create project');
            }
        } catch (error) {
            console.error('Error creating project:', error);
            alert('Network error. Please try again.');
        }
    };

    // Helper to prevent XSS
    function escapeHtml(str) {
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }

    loadProjects();
});
