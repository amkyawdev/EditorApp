document.addEventListener('DOMContentLoaded', () => {
    const projectsGrid = document.getElementById('projects-grid');
    const newProjectBtn = document.getElementById('new-project-btn');
    const projectModal = document.getElementById('project-modal');
    const closeModal = document.querySelector('.close');
    const newProjectForm = document.getElementById('new-project-form');

    // Load projects
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
                    <h3>${project}</h3>
                    <div class="project-actions">
                        <button class="btn btn-primary open-btn" data-name="${project}">Open</button>
                        <button class="btn btn-danger delete-btn" data-name="${project}">Delete</button>
                    </div>
                `;
                projectsGrid.appendChild(card);
            });

            // Add event listeners to buttons
            document.querySelectorAll('.open-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const name = e.target.getAttribute('data-name');
                    localStorage.setItem('currentProject', name);
                    window.location.href = '/editing';
                });
            });

            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const name = e.target.getAttribute('data-name');
                    if (confirm(`Are you sure you want to delete project "${name}"?`)) {
                        const response = await fetch(`/api/projects/${name}`, { method: 'DELETE' });
                        if (response.ok) {
                            loadProjects();
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

    // Create project
    newProjectForm.onsubmit = async (e) => {
        e.preventDefault();
        const name = document.getElementById('project-name').value;
        
        try {
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name })
            });
            
            if (response.ok) {
                projectModal.style.display = 'none';
                newProjectForm.reset();
                loadProjects();
            } else {
                const data = await response.json();
                alert(data.error || 'Failed to create project');
            }
        } catch (error) {
            console.error('Error creating project:', error);
        }
    };

    loadProjects();
});
