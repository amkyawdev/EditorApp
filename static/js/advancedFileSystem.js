// Advanced File System - AmkyawDev EditorApp

class AdvancedFileSystem {
    constructor() {
        this.currentPath = '/';
        this.files = new Map();
        this.clipboard = null;
        this.init();
    }

    init() {
        this.setupDragDrop();
        this.initContextMenu();
    }

    setupDragDrop() {
        document.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });

        document.addEventListener('drop', (e) => {
            e.preventDefault();
            this.handleFileDrop(e);
        });
    }

    handleFileDrop(e) {
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.uploadFiles(files);
        }
    }

    async uploadFiles(files) {
        for (const file of files) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.files.set(file.name, e.target.result);
                console.log(`📤 Uploaded: ${file.name}`);
            };
            reader.readAsText(file);
        }
    }

    initContextMenu() {
        document.addEventListener('contextmenu', (e) => {
            const fileItem = e.target.closest('.file-item');
            if (fileItem) {
                e.preventDefault();
                this.showContextMenu(e, fileItem.dataset.filename);
            }
        });

        document.addEventListener('click', () => {
            this.hideContextMenu();
        });
    }

    showContextMenu(e, filename) {
        const menu = document.createElement('div');
        menu.className = 'context-menu';
        menu.innerHTML = `
            <div class="context-menu-item" data-action="open">Open</div>
            <div class="context-menu-item" data-action="rename">Rename</div>
            <div class="context-menu-item" data-action="duplicate">Duplicate</div>
            <div class="context-menu-item" data-action="delete">Delete</div>
        `;
        menu.style.cssText = `
            position: fixed;
            left: ${e.pageX}px;
            top: ${e.pageY}px;
            background: var(--secondary);
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 8px 0;
            z-index: 10000;
            min-width: 150px;
        `;

        document.body.appendChild(menu);

        menu.querySelectorAll('.context-menu-item').forEach(item => {
            item.addEventListener('click', () => {
                this.handleContextAction(item.dataset.action, filename);
            });
        });
    }

    hideContextMenu() {
        document.querySelectorAll('.context-menu').forEach(m => m.remove());
    }

    handleContextAction(action, filename) {
        switch (action) {
            case 'open':
                window.editorApp?.openFile(filename);
                break;
            case 'rename':
                this.renameFile(filename);
                break;
            case 'duplicate':
                this.duplicateFile(filename);
                break;
            case 'delete':
                this.deleteFile(filename);
                break;
        }
    }

    async renameFile(oldName) {
        const newName = prompt('Enter new name:', oldName);
        if (newName && newName !== oldName) {
            console.log(`✏️ Renamed: ${oldName} → ${newName}`);
        }
    }

    async duplicateFile(filename) {
        console.log(`📋 Duplicated: ${filename}`);
    }

    async deleteFile(filename) {
        if (confirm(`Delete ${filename}?`)) {
            console.log(`🗑️ Deleted: ${filename}`);
        }
    }

    // File search
    searchFiles(query) {
        const results = [];
        this.files.forEach((content, name) => {
            if (name.toLowerCase().includes(query.toLowerCase()) || 
                content.toLowerCase().includes(query.toLowerCase())) {
                results.push(name);
            }
        });
        return results;
    }

    // Create new file
    createFile(name, content = '') {
        this.files.set(name, content);
        console.log(`✨ Created: ${name}`);
    }

    // Read file
    readFile(name) {
        return this.files.get(name);
    }

    // Write file
    writeFile(name, content) {
        this.files.set(name, content);
    }

    // Delete file
    removeFile(name) {
        this.files.delete(name);
    }

    // List all files
    listFiles() {
        return Array.from(this.files.keys());
    }
}

// Initialize when DOM ready
document.addEventListener('DOMContentLoaded', () => {
    window.advancedFileSystem = new AdvancedFileSystem();
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedFileSystem;
}