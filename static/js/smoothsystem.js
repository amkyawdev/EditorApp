document.addEventListener('DOMContentLoaded', () => {
    // Smooth UI interactions
    const editorTextarea = document.getElementById('editor-textarea');
    
    // Tab support in textarea
    editorTextarea.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = editorTextarea.selectionStart;
            const end = editorTextarea.selectionEnd;
            
            // Set textarea value to: text before caret + tab + text after caret
            editorTextarea.value = editorTextarea.value.substring(0, start) +
                "    " + editorTextarea.value.substring(end);
            
            // Put caret at right position again
            editorTextarea.selectionStart = editorTextarea.selectionEnd = start + 4;
        }
    });

    // Auto-save feature (optional, can be enabled)
    let autoSaveTimeout;
    editorTextarea.addEventListener('input', () => {
        clearTimeout(autoSaveTimeout);
        autoSaveTimeout = setTimeout(() => {
            console.log('Auto-saving...');
            // Implement auto-save logic here if needed
        }, 2000);
    });
});
