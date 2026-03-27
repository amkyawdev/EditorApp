// JavaScript Editor Component - AmkyawDev EditorApp

class JSEditor {
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
        this.editor.className = 'js-editor code-editor';
        this.editor.placeholder = '// Write your JavaScript here\ndocument.addEventListener("DOMContentLoaded", () => {\n  console.log("Hello World!");\n});';
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

        // Auto-close braces and brackets
        const pairs = { '(': ')', '[': ']', '{': '}' };
        if (pairs[e.key]) {
            e.preventDefault();
            const start = this.editor.selectionStart;
            const end = this.editor.selectionEnd;
            const value = this.editor.value;
            const selected = value.substring(start, end);
            
            this.editor.value = value.substring(0, start) + e.key + selected + pairs[e.key] + value.substring(end);
            this.editor.selectionStart = start + 1;
            this.editor.selectionEnd = end + 1;
            this.onChange();
        }

        // Quick comment
        if (e.key === '/' && e.shiftKey) {
            e.preventDefault();
            this.insert('// ');
        }
    }

    insert(text) {
        const start = this.editor.selectionStart;
        const end = this.editor.selectionEnd;
        const value = this.editor.value;
        
        this.editor.value = value.substring(0, start) + text + value.substring(end);
        this.editor.selectionStart = this.editor.selectionEnd = start + text.length;
        this.onChange();
    }

    onChange() {
        this.updateLineNumbers();
        
        this.container.dispatchEvent(new CustomEvent('jsChange', {
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

    setValue(js) {
        this.editor.value = js;
        this.updateLineNumbers();
    }

    focus() {
        this.editor.focus();
    }

    // Execute JavaScript in preview
    execute() {
        const code = this.getValue();
        try {
            eval(code);
        } catch (error) {
            console.error('JavaScript Error:', error);
        }
    }

    // Insert JS snippet
    insertSnippet(snippet) {
        const snippets = {
            'function': 'function myFunction() {\n  \n}',
            'class': 'class MyClass {\n  constructor() {\n    \n  }\n}',
            'event': "element.addEventListener('click', () => {\n  \n});",
            'async': 'async function fetchData() {\n  const response = await fetch(url);\n  return response.json();\n}',
            'promise': 'new Promise((resolve, reject) => {\n  \n});',
            'arrow': 'const myFunc = () => {\n  \n};',
            'dom': "document.querySelector('.element').addEventListener('click', (e) => {\n  \n});",
            'ajax': "fetch('/api/data')\n  .then(response => response.json())\n  .then(data => console.log(data));"
        };

        if (snippets[snippet]) {
            this.insert(snippets[snippet]);
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = JSEditor;
}