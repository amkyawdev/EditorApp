// HTML Editor Component - AmkyawDev EditorApp

class HTMLEditor {
    constructor(container) {
        this.container = container;
        this.mode = 'code'; // 'code' or 'preview'
        this.init();
    }

    init() {
        this.createEditor();
        this.bindEvents();
    }

    createEditor() {
        this.editor = document.createElement('textarea');
        this.editor.className = 'html-editor code-editor';
        this.editor.placeholder = '<!-- Write your HTML here -->\n<div class="container">\n  <h1>Hello World!</h1>\n</div>';
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

        // Auto-close tags
        if (e.key === '>') {
            this.autoCloseTag();
        }
    }

    autoCloseTag() {
        const value = this.editor.value;
        const cursorPos = this.editor.selectionStart;
        const textBefore = value.substring(0, cursorPos);
        const textAfter = value.substring(cursorPos);
        
        // Check if there's an unclosed tag
        const match = textBefore.match(/<(\w+)[^>]*$/);
        if (match && !textBefore.includes(`</${match[1]}>`)) {
            const closingTag = `</${match[1]}>`;
            this.editor.value = value.substring(0, cursorPos) + closingTag + textAfter;
            this.editor.selectionStart = this.editor.selectionEnd = cursorPos;
        }
    }

    onChange() {
        this.updateLineNumbers();
        
        // Emit change event
        this.container.dispatchEvent(new CustomEvent('htmlChange', {
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

    setValue(html) {
        this.editor.value = html;
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

    // Insert HTML snippet
    insertSnippet(snippet) {
        const snippets = {
            'div': '<div class="box">\n  \n</div>',
            'button': '<button class="btn">Click Me</button>',
            'link': '<a href="#" class="link">Link</a>',
            'image': '<img src="image.jpg" alt="Image" class="img-responsive">',
            'list': '<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>',
            'table': '<table class="table">\n  <tr><th>Header</th></tr>\n  <tr><td>Data</td></tr>\n</table>',
            'form': '<form class="form">\n  <input type="text" placeholder="Name">\n  <button type="submit">Submit</button>\n</form>',
            'card': '<div class="card">\n  <h3>Title</h3>\n  <p>Content</p>\n</div>'
        };

        if (snippets[snippet]) {
            this.insert(snippets[snippet]);
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = HTMLEditor;
}