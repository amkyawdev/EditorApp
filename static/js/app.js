// Main Frontend Logic - AmkyawDev EditorApp

class EditorApp {
    constructor() {
        this.apiBase = '/api';
        this.currentProject = 'default';
        this.currentFile = null;
        this.files = [];
        this.init();
    }

    async init() {
        this.bindEvents();
        await this.loadProjects();
        this.initSmoothSystem();
        this.checkHealth();
    }

    bindEvents() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigate(link.getAttribute('href'));
            });
        });

        // File operations
        document.addEventListener('click', (e) => {
            if (e.target.closest('.file-item')) {
                const filename = e.target.closest('.file-item').dataset.filename;
                this.openFile(filename);
            }
        });

        // Save shortcut
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                this.saveCurrentFile();
            }
        });
    }

    async checkHealth() {
        try {
            const response = await fetch(`${this.apiBase}/health`);
            const data = await response.json();
            console.log('✅ API Status:', data.message);
        } catch (error) {
            console.error('❌ API Health Check Failed:', error);
        }
    }

    async loadProjects() {
        try {
            const response = await fetch(`${this.apiBase}/projects/`);
            this.projects = await response.json();
            console.log('📁 Projects loaded:', this.projects);
        } catch (error) {
            console.error('Failed to load projects:', error);
            this.projects = ['default'];
        }
    }

    async loadFiles(projectName = 'default') {
        try {
            const response = await fetch(`${this.apiBase}/projects/${projectName}/files`);
            const data = await response.json();
            this.files = data.files || [];
            this.renderFileTree();
            return this.files;
        } catch (error) {
            console.error('Failed to load files:', error);
            return [];
        }
    }

    renderFileTree() {
        const fileTree = document.querySelector('.file-tree');
        if (!fileTree) return;

        fileTree.innerHTML = this.files.map(file => `
            <div class="file-item" data-filename="${file.name}">
                <span class="file-icon ${this.getFileIcon(file.name)}">${this.getFileEmoji(file.name)}</span>
                <span>${file.name}</span>
            </div>
        `).join('');
    }

    getFileIcon(filename) {
        const ext = filename.split('.').pop();
        return ext;
    }

    getFileEmoji(filename) {
        if (filename.endsWith('.html')) return '📄';
        if (filename.endsWith('.css')) return '🎨';
        if (filename.endsWith('.js')) return '⚡';
        if (filename.includes('folder')) return '📁';
        return '📃';
    }

    async openFile(filename) {
        try {
            const response = await fetch(`${this.apiBase}/files/read?path=${encodeURIComponent(filename)}&project=${this.currentProject}`);
            const data = await response.json();
            
            if (data.content !== undefined) {
                this.currentFile = filename;
                this.displayFileContent(filename, data.content);
                this.updateActiveFile(filename);
            }
        } catch (error) {
            console.error('Failed to open file:', error);
            this.showNotification('Failed to open file', 'error');
        }
    }

    displayFileContent(filename, content) {
        const editor = document.querySelector('.code-editor');
        const lineNumbers = document.querySelector('.line-numbers');
        
        if (editor) {
            editor.value = content;
            this.highlightSyntax(editor);
        }

        if (lineNumbers) {
            const lines = content.split('\n').length;
            lineNumbers.innerHTML = Array.from({ length: lines }, (_, i) => i + 1).join('\n');
        }
    }

    highlightSyntax(editor) {
        // Basic syntax highlighting
        let content = editor.value;
        const ext = this.currentFile?.split('.').pop();

        if (ext === 'html') {
            content = content.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            content = content.replace(/(&lt;\/?[\w-]+)/g, '<span class="html-tag">$1</span>');
        }
        
        editor.value = content;
    }

    updateActiveFile(filename) {
        document.querySelectorAll('.file-item').forEach(item => {
            item.classList.toggle('active', item.dataset.filename === filename);
        });
    }

    async saveCurrentFile() {
        if (!this.currentFile) {
            this.showNotification('No file selected', 'warning');
            return;
        }

        const editor = document.querySelector('.code-editor');
        const content = editor?.value;
        
        if (content === undefined) return;

        try {
            const response = await fetch(`${this.apiBase}/files/save`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    path: this.currentFile,
                    content: content,
                    project: this.currentProject
                })
            });

            if (response.ok) {
                this.showNotification('File saved!', 'success');
                this.updatePreview();
            } else {
                throw new Error('Save failed');
            }
        } catch (error) {
            console.error('Failed to save:', error);
            this.showNotification('Failed to save file', 'error');
        }
    }

    updatePreview() {
        const iframe = document.querySelector('.preview-iframe');
        if (!iframe) return;

        const htmlEditor = document.querySelector('.code-editor');
        if (!htmlEditor) return;

        const doc = iframe.contentDocument || iframe.contentWindow.document;
        doc.open();
        doc.write(htmlEditor.value);
        doc.close();
    }

    navigate(path) {
        window.location.href = path;
    }

    initSmoothSystem() {
        if (typeof SmoothSystem !== 'undefined') {
            this.smoothSystem = new SmoothSystem();
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 90px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 10px;
            background: ${type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--error)' : 'var(--accent)'};
            color: white;
            font-weight: 600;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.editorApp = new EditorApp();
});

// Export for other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EditorApp;
}