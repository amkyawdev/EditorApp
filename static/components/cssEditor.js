// CSS Editor Component - AmkyawDev EditorApp

class CSSEditor {
    constructor(container) {
        this.container = container;
        this.init();
    }

    init() {
        this.createEditor();
        this.bindEvents();
    }

    createEditor() {
        this.editor = document.createElement('textarea');
        this.editor.className = 'css-editor code-editor';
        this.editor.placeholder = '/* Write your CSS here */\n.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}';
        this.editor.spellcheck = false;
        
        if (this.container) {
            this.container.appendChild(this.editor);
        }
    }

    bindEvents() {
        this.editor.addEventListener('input', () => this.onChange());
        this.editor.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }

    handleKeyDown(e) {
        // Tab key handling
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = this.editor.selectionStart;
            const end = this.editor.selectionEnd;
            const value = this.editor.value;
            
            this.editor.value = value.substring(0, start) + '  ' + value.substring(end);
            this.editor.selectionStart = this.editor.selectionEnd = start + 2;
            this.onChange();
        }

        // Auto-add closing brace
        if (e.key === '{') {
            e.preventDefault();
            const start = this.editor.selectionStart;
            const end = this.editor.selectionEnd;
            const value = this.editor.value;
            
            this.editor.value = value.substring(0, start) + '{}' + value.substring(end);
            this.editor.selectionStart = this.editor.selectionEnd = start + 1;
            this.onChange();
        }
    }

    onChange() {
        this.updateLineNumbers();
        
        this.container.dispatchEvent(new CustomEvent('cssChange', {
            detail: { value: this.editor.value }
        }));
    }

    updateLineNumbers() {
        const lineNumbers = this.container.querySelector('.line-numbers');
        if (!lineNumbers) return;

        const lines = this.editor.value.split('\n').length;
        lineNumbers.innerHTML = Array.from({ length: lines }, (_, i) => i + 1).join('\n');
    }

    getValue() {
        return this.editor.value;
    }

    setValue(css) {
        this.editor.value = css;
        this.updateLineNumbers();
    }

    focus() {
        this.editor.focus();
    }

    insert(text) {
        const start = this.editor.selectionStart;
        const end = this.editor.selectionEnd;
        const value = this.editor.value;
        
        this.editor.value = value.substring(0, start) + text + value.substring(end);
        this.editor.selectionStart = this.editor.selectionEnd = start + text.length;
        this.onChange();
    }

    // Insert CSS snippet
    insertSnippet(snippet) {
        const snippets = {
            'flex': 'display: flex;\njustify-content: center;\nalign-items: center;',
            'grid': 'display: grid;\ngrid-template-columns: repeat(3, 1fr);\ngap: 20px;',
            'animation': 'animation: fadeIn 0.3s ease;\n@keyframes fadeIn {\n  from { opacity: 0; }\n  to { opacity: 1; }\n}',
            'gradient': 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);',
            'shadow': 'box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);',
            'responsive': '@media (max-width: 768px) {\n  \n}',
            'transition': 'transition: all 0.3s ease;',
            'transform': 'transform: translateX(-50%);\ntransform-origin: center;'
        };

        if (snippets[snippet]) {
            this.insert(snippets[snippet]);
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CSSEditor;
}