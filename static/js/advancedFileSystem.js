document.addEventListener('DOMContentLoaded', () => {
    const projectName = localStorage.getItem('currentProject');
    const projectNameDisplay = document.getElementById('current-project-name');
    const fileNameDisplay = document.getElementById('current-file-name');
    const fileList = document.getElementById('file-list');
    const editorTextarea = document.getElementById('editor-textarea');
    const saveBtn = document.getElementById('save-btn');
    const previewBtn = document.getElementById('preview-btn');
    const previewPanel = document.getElementById('preview-panel');
    const closePreview = document.getElementById('close-preview');
    const previewIframe = document.getElementById('preview-iframe');

    let currentFile = 'index.html';

    if (!projectName) {
        window.location.href = '/main';
        return;
    }

    projectNameDisplay.textContent = projectName;

    // Load files
    async function loadFiles() {
        try {
            const response = await fetch(`/api/files/${projectName}`);
            const files = await response.json();
            
            fileList.innerHTML = '';
            files.forEach(file => {
                const li = document.createElement('li');
                li.className = `file-item ${file === currentFile ? 'active' : ''}`;
                li.textContent = file;
                li.onclick = () => openFile(file);
                fileList.appendChild(li);
            });

            if (files.length > 0 && !currentFile) {
                openFile(files[0]);
            } else if (currentFile) {
                openFile(currentFile);
            }
        } catch (error) {
            console.error('Error loading files:', error);
        }
    }

    // Open file
    async function openFile(file) {
        currentFile = file;
        fileNameDisplay.textContent = file;
        
        // Update active state in sidebar
        document.querySelectorAll('.file-item').forEach(item => {
            item.classList.toggle('active', item.textContent === file);
        });

        try {
            const response = await fetch(`/api/files/${projectName}/${file}`);
            const data = await response.json();
            editorTextarea.value = data.content || '';
        } catch (error) {
            console.error('Error opening file:', error);
        }
    }

    // Save file
    saveBtn.onclick = async () => {
        const content = editorTextarea.value;
        try {
            const response = await fetch(`/api/files/${projectName}/${currentFile}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content })
            });
            
            if (response.ok) {
                alert('File saved successfully!');
                if (!previewPanel.classList.contains('hidden')) {
                    updatePreview();
                }
            }
        } catch (error) {
            console.error('Error saving file:', error);
        }
    };

    // Preview logic
    previewBtn.onclick = () => {
        previewPanel.classList.remove('hidden');
        updatePreview();
    };

    closePreview.onclick = () => {
        previewPanel.classList.add('hidden');
    };

    function updatePreview() {
        previewIframe.src = `/api/preview/${projectName}/index.html?t=${new Date().getTime()}`;
    }

    loadFiles();
});
