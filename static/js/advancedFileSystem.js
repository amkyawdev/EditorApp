/**
 * advancedFileSystem.js
 * Manages project files, editor tabs, content synchronization, and backend communication.
 * Assumes Flask backend with the following endpoints:
 *   - GET /api/project/<project_id>         -> returns { name, files: [{ id, name, type, content? }] }
 *   - GET /api/file/<file_id>               -> returns { content }
 *   - POST /api/file/save                   -> expects { file_id, content }
 *   - POST /api/file/create                 -> expects { project_id, name, type }
 *
 * Also integrates with external editor modules (htmlEditor, cssEditor, jsEditor, previewSystem)
 * if they are loaded and provide setContent/getContent methods. Otherwise falls back to plain textarea.
 */

(function() {
    // ---------- DOM Elements ----------
    const projectNameSpan = document.getElementById('current-project-name');
    const fileNameSpan = document.getElementById('current-file-name');
    const fileListUl = document.getElementById('file-list');
    const editorTabsDiv = document.getElementById('editor-tabs');
    const editorTextarea = document.getElementById('editor-textarea');
    const saveBtn = document.getElementById('save-btn');
    const previewBtn = document.getElementById('preview-btn');
    const newFileBtn = document.getElementById('new-file-btn');
    const previewIframe = document.getElementById('preview-iframe');

    // ---------- State ----------
    let currentProject = null;          // { id, name, files: [] }
    let currentFile = null;             // { id, name, type, content }
    let openFiles = new Map();          // fileId -> { name, type, content, dirty: false, element: tabDom }
    let activeFileId = null;
    let unsavedChanges = false;

    // ---------- Helper: Determine file type from extension ----------
    function getFileType(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        if (ext === 'html') return 'html';
        if (ext === 'css') return 'css';
        if (ext === 'js') return 'js';
        return 'text';
    }

    // ---------- Editor Integration (fallback to plain textarea) ----------
    // The external editors (htmlEditor, cssEditor, jsEditor) are expected to be global objects
    // that provide setContent(editor, content) and getContent(editor) methods.
    // We store the current editor instance (if any) in a variable.
    let currentEditorInstance = null;
    let editorType = null;

    function initEditorForFile(file) {
        // Destroy previous editor if any
        if (currentEditorInstance && window.destroyEditor) {
            window.destroyEditor(currentEditorInstance);
        }
        currentEditorInstance = null;
        editorType = null;

        // Check if specialized editor component exists for this file type
        const type = file.type;
        if (type === 'html' && window.HtmlEditor && typeof window.HtmlEditor.init === 'function') {
            currentEditorInstance = window.HtmlEditor.init(editorTextarea);
            editorType = 'html';
        } else if (type === 'css' && window.CssEditor && typeof window.CssEditor.init === 'function') {
            currentEditorInstance = window.CssEditor.init(editorTextarea);
            editorType = 'css';
        } else if (type === 'js' && window.JsEditor && typeof window.JsEditor.init === 'function') {
            currentEditorInstance = window.JsEditor.init(editorTextarea);
            editorType = 'js';
        } else {
            // Plain textarea: no special editor
            editorTextarea.value = file.content || '';
            editorTextarea.disabled = false;
            currentEditorInstance = editorTextarea; // placeholder
            editorType = 'plain';
        }

        // If we have a specialized editor, set its content
        if (currentEditorInstance && editorType !== 'plain') {
            const setter = getEditorSetter(editorType);
            if (setter) setter(currentEditorInstance, file.content || '');
        }

        // Listen for input changes to mark dirty
        if (editorType === 'plain') {
            editorTextarea.addEventListener('input', onEditorChange);
        } else {
            // For specialized editors, we need to hook into their change events.
            // They might provide an on('change', callback) or similar.
            // We'll assume they expose an .onChange method or we can poll.
            // For simplicity, we'll use a polling approach or rely on the editor's own events.
            // Here we try to attach a change listener if the editor instance has an 'on' method.
            if (currentEditorInstance && typeof currentEditorInstance.on === 'function') {
                currentEditorInstance.on('change', onEditorChange);
            } else if (currentEditorInstance && typeof currentEditorInstance.addEventListener === 'function') {
                currentEditorInstance.addEventListener('input', onEditorChange);
            } else {
                // Fallback: poll every 500ms (not ideal but works)
                if (window.editorPollInterval) clearInterval(window.editorPollInterval);
                window.editorPollInterval = setInterval(() => {
                    if (activeFileId && openFiles.has(activeFileId)) {
                        const newContent = getCurrentEditorContent();
                        const fileObj = openFiles.get(activeFileId);
                        if (newContent !== fileObj.content) {
                            fileObj.content = newContent;
                            fileObj.dirty = true;
                            updateTabDirtyIndicator(activeFileId, true);
                            unsavedChanges = true;
                        }
                    }
                }, 500);
            }
        }
    }

    function getEditorSetter(type) {
        if (type === 'html' && window.HtmlEditor && window.HtmlEditor.setContent) return window.HtmlEditor.setContent;
        if (type === 'css' && window.CssEditor && window.CssEditor.setContent) return window.CssEditor.setContent;
        if (type === 'js' && window.JsEditor && window.JsEditor.setContent) return window.JsEditor.setContent;
        return null;
    }

    function getEditorGetter(type) {
        if (type === 'html' && window.HtmlEditor && window.HtmlEditor.getContent) return window.HtmlEditor.getContent;
        if (type === 'css' && window.CssEditor && window.CssEditor.getContent) return window.CssEditor.getContent;
        if (type === 'js' && window.JsEditor && window.JsEditor.getContent) return window.JsEditor.getContent;
        return null;
    }

    function getCurrentEditorContent() {
        if (editorType === 'plain') {
            return editorTextarea.value;
        }
        const getter = getEditorGetter(editorType);
        if (getter && currentEditorInstance) {
            return getter(currentEditorInstance);
        }
        return '';
    }

    function setCurrentEditorContent(content) {
        if (editorType === 'plain') {
            editorTextarea.value = content;
            return;
        }
        const setter = getEditorSetter(editorType);
        if (setter && currentEditorInstance) {
            setter(currentEditorInstance, content);
        }
    }

    function onEditorChange() {
        if (!activeFileId) return;
        const newContent = getCurrentEditorContent();
        const fileObj = openFiles.get(activeFileId);
        if (fileObj && newContent !== fileObj.content) {
            fileObj.content = newContent;
            fileObj.dirty = true;
            updateTabDirtyIndicator(activeFileId, true);
            unsavedChanges = true;
            // Trigger preview update if needed (debounced)
            debouncedUpdatePreview();
        }
    }

    // ---------- Preview Handling ----------
    let previewUpdateTimeout = null;
    function debouncedUpdatePreview() {
        if (previewUpdateTimeout) clearTimeout(previewUpdateTimeout);
        previewUpdateTimeout = setTimeout(() => {
            updatePreview();
        }, 300);
    }

    function updatePreview() {
        // If preview panel is not visible, skip to save resources
        const previewPanel = document.getElementById('preview-panel');
        if (previewPanel && previewPanel.classList.contains('hidden')) return;

        // Use previewSystem.js if available
        if (window.PreviewSystem && typeof window.PreviewSystem.update === 'function') {
            // Collect all files content
            const files = {};
            for (let [id, file] of openFiles.entries()) {
                files[file.name] = file.content;
            }
            window.PreviewSystem.update(previewIframe, files);
        } else {
            // Simple fallback: combine HTML, CSS, JS for demo
            let htmlContent = '';
            let cssContent = '';
            let jsContent = '';
            for (let [id, file] of openFiles.entries()) {
                if (file.name.endsWith('.html')) htmlContent = file.content;
                if (file.name.endsWith('.css')) cssContent = file.content;
                if (file.name.endsWith('.js')) jsContent = file.content;
            }
            const fullHtml = `
                <!DOCTYPE html>
                <html>
                <head><meta charset="UTF-8"><style>${cssContent}</style></head>
                <body>${htmlContent}<script>${jsContent}<\/script></body>
                </html>
            `;
            const doc = previewIframe.contentDocument;
            doc.open();
            doc.write(fullHtml);
            doc.close();
        }
    }

    // ---------- Tabs Management ----------
    function renderTabs() {
        editorTabsDiv.innerHTML = '';
        for (let [fileId, file] of openFiles.entries()) {
            const tab = document.createElement('div');
            tab.className = 'tab' + (fileId === activeFileId ? ' active' : '');
            tab.textContent = file.name;
            tab.setAttribute('data-file-id', fileId);
            if (file.dirty) {
                const dirtySpan = document.createElement('span');
                dirtySpan.textContent = '●';
                dirtySpan.style.color = '#f39c12';
                dirtySpan.style.marginLeft = '5px';
                dirtySpan.style.fontSize = '0.7rem';
                tab.appendChild(dirtySpan);
            }
            tab.addEventListener('click', (e) => {
                e.stopPropagation();
                switchToFile(fileId);
            });
            editorTabsDiv.appendChild(tab);
            file.element = tab;
        }
    }

    function updateTabDirtyIndicator(fileId, dirty) {
        const tab = openFiles.get(fileId)?.element;
        if (tab) {
            // Remove existing dirty marker
            const existing = tab.querySelector('span');
            if (existing) existing.remove();
            if (dirty) {
                const dirtySpan = document.createElement('span');
                dirtySpan.textContent = '●';
                dirtySpan.style.color = '#f39c12';
                dirtySpan.style.marginLeft = '5px';
                dirtySpan.style.fontSize = '0.7rem';
                tab.appendChild(dirtySpan);
            }
        }
    }

    function switchToFile(fileId) {
        if (activeFileId === fileId) return;
        // Save current file content before switching
        if (activeFileId && openFiles.has(activeFileId)) {
            const currentFileObj = openFiles.get(activeFileId);
            currentFileObj.content = getCurrentEditorContent();
        }
        activeFileId = fileId;
        const file = openFiles.get(fileId);
        currentFile = { id: fileId, name: file.name, type: file.type, content: file.content };
        fileNameSpan.textContent = file.name;
        // Re-initialize editor for this file type
        initEditorForFile(currentFile);
        // Update active class on tabs
        document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
        if (file.element) file.element.classList.add('active');
        // Update file list active highlight
        document.querySelectorAll('.file-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-file-id') === fileId) item.classList.add('active');
        });
    }

    // ---------- File List Rendering ----------
    function renderFileList() {
        fileListUl.innerHTML = '';
        currentProject.files.forEach(file => {
            const li = document.createElement('li');
            li.className = 'file-item';
            if (currentFile && currentFile.id === file.id) li.classList.add('active');
            li.setAttribute('data-file-id', file.id);
            li.innerHTML = `<span>📄 ${file.name}</span>`;
            li.addEventListener('click', () => {
                // If file not already open, open it
                if (!openFiles.has(file.id)) {
                    openFile(file.id, file.name, file.type, file.content || '');
                }
                switchToFile(file.id);
            });
            fileListUl.appendChild(li);
        });
    }

    // ---------- Open a file (add to tabs, load content if needed) ----------
    function openFile(fileId, name, type, content) {
        if (openFiles.has(fileId)) return;
        openFiles.set(fileId, { name, type, content, dirty: false, element: null });
        renderTabs();
        // If this is the first file, set as active
        if (openFiles.size === 1) {
            switchToFile(fileId);
        }
    }

    // ---------- Save current file ----------
    async function saveCurrentFile() {
        if (!activeFileId) return;
        const fileObj = openFiles.get(activeFileId);
        if (!fileObj) return;
        const content = getCurrentEditorContent();
        fileObj.content = content;
        fileObj.dirty = false;
        updateTabDirtyIndicator(activeFileId, false);
        unsavedChanges = false;

        // Send to server
        try {
            const response = await fetch('/api/file/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ file_id: activeFileId, content: content })
            });
            if (!response.ok) throw new Error('Save failed');
            console.log('File saved successfully');
            // Optionally show a temporary notification
        } catch (err) {
            console.error('Error saving file:', err);
            alert('Failed to save file. Please try again.');
            // Revert dirty flag?
            fileObj.dirty = true;
            updateTabDirtyIndicator(activeFileId, true);
            unsavedChanges = true;
        }
        debouncedUpdatePreview();
    }

    // ---------- Create new file ----------
    async function createNewFile() {
        const fileName = prompt('Enter file name (e.g., style.css, script.js):', 'newfile.html');
        if (!fileName) return;
        // Validate extension
        const type = getFileType(fileName);
        if (!['html', 'css', 'js'].includes(type)) {
            alert('Only .html, .css, .js files are supported.');
            return;
        }
        try {
            const response = await fetch('/api/file/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ project_id: currentProject.id, name: fileName, type: type })
            });
            if (!response.ok) throw new Error('Create failed');
            const newFile = await response.json(); // expected { id, name, type, content: '' }
            // Add to project files list
            currentProject.files.push(newFile);
            renderFileList();
            // Open the new file
            openFile(newFile.id, newFile.name, newFile.type, newFile.content || '');
            switchToFile(newFile.id);
        } catch (err) {
            console.error('Error creating file:', err);
            alert('Failed to create file.');
        }
    }

    // ---------- Load initial project data ----------
    async function loadProject() {
        // Extract project ID from URL query parameter or path
        let projectId = null;
        const urlParams = new URLSearchParams(window.location.search);
        projectId = urlParams.get('project_id');
        if (!projectId) {
            // fallback: try to get from meta tag or assume default
            console.warn('No project_id in URL. Using demo mode.');
            // For demo, you can set a default or fetch from session
            projectId = 'demo';
        }

        try {
            const response = await fetch(`/api/project/${projectId}`);
            if (!response.ok) throw new Error('Failed to load project');
            const project = await response.json();
            currentProject = project;
            projectNameSpan.textContent = project.name;

            // Populate files and open the first file automatically
            if (project.files && project.files.length) {
                project.files.forEach(file => {
                    // Initially, we don't load content until needed to save bandwidth
                    // But we need content for the first file to display.
                    // We'll load content on demand. For simplicity, we'll load all now.
                });
                // Load first file's content
                const firstFile = project.files[0];
                await loadFileContent(firstFile.id);
                firstFile.content = firstFile.content || '';
                openFile(firstFile.id, firstFile.name, firstFile.type, firstFile.content);
                renderFileList();
                switchToFile(firstFile.id);
            } else {
                // No files, maybe create a default index.html
                createNewFile(); // or show message
            }
        } catch (err) {
            console.error('Error loading project:', err);
            alert('Could not load project. Please check connection or project ID.');
        }
    }

    async function loadFileContent(fileId) {
        try {
            const response = await fetch(`/api/file/${fileId}`);
            if (!response.ok) throw new Error('Failed to load file content');
            const data = await response.json();
            return data.content;
        } catch (err) {
            console.error('Error loading file content:', err);
            return '';
        }
    }

    // ---------- Event Listeners ----------
    saveBtn.addEventListener('click', saveCurrentFile);
    newFileBtn.addEventListener('click', createNewFile);
    previewBtn.addEventListener('click', () => {
        const previewPanel = document.getElementById('preview-panel');
        previewPanel.classList.toggle('hidden');
        if (!previewPanel.classList.contains('hidden')) {
            updatePreview();
        }
    });
    document.getElementById('close-preview').addEventListener('click', () => {
        document.getElementById('preview-panel').classList.add('hidden');
    });

    // Warn before leaving if unsaved changes
    window.addEventListener('beforeunload', (e) => {
        if (unsavedChanges) {
            e.preventDefault();
            e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        }
    });

    // Initialize the application
    loadProject();
})();
