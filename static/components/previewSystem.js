// Preview System Component - AmkyawDev EditorApp

class PreviewSystem {
    constructor(container) {
        this.container = container;
        this.iframe = null;
        this.init();
    }

    init() {
        this.createIframe();
    }

    createIframe() {
        this.iframe = document.createElement('iframe');
        this.iframe.className = 'preview-iframe';
        this.iframe.title = 'Preview';
        this.iframe.sandbox = 'allow-scripts allow-same-origin';
        
        if (this.container) {
            this.container.appendChild(this.iframe);
        }
    }

    // Render HTML, CSS, and JS
    render(html, css, js) {
        const content = this.buildDocument(html, css, js);
        this.writeContent(content);
    }

    // Build complete HTML document
    buildDocument(html, css, js) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        /* Reset and base styles */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        ${css || ''}
    </style>
</head>
<body>
    ${html || '<h1>Preview</h1><p>Start coding to see your changes here!</p>'}
    <script>
        try {
            ${js || ''}
        } catch (e) {
            console.error('Script Error:', e);
        }
    </script>
</body>
</html>`;
    }

    // Write content to iframe
    writeContent(content) {
        if (!this.iframe) return;
        
        const doc = this.iframe.contentDocument || this.iframe.contentWindow.document;
        doc.open();
        doc.write(content);
        doc.close();
    }

    // Update only HTML
    updateHTML(html) {
        const doc = this.iframe?.contentDocument;
        if (!doc) return;
        
        const body = doc.querySelector('body');
        if (body) {
            // Preserve existing style and script
            const existingStyles = doc.querySelector('style');
            const existingScripts = doc.querySelector('script');
            
            body.innerHTML = html;
        } else {
            this.render(html, this.getCSS(), this.getJS());
        }
    }

    // Update only CSS
    updateCSS(css) {
        const doc = this.iframe?.contentDocument;
        if (!doc) return;
        
        let style = doc.querySelector('style');
        if (!style) {
            style = doc.createElement('style');
            doc.head.appendChild(style);
        }
        style.textContent = css;
    }

    // Update only JS
    updateJS(js) {
        const doc = this.iframe?.contentDocument;
        if (!doc) return;
        
        // Remove old script
        const oldScript = doc.querySelector('script:not([src])');
        if (oldScript) {
            oldScript.remove();
        }
        
        // Add new script
        const newScript = doc.createElement('script');
        newScript.textContent = js;
        doc.body.appendChild(newScript);
    }

    // Get current HTML
    getHTML() {
        const doc = this.iframe?.contentDocument;
        return doc?.body?.innerHTML || '';
    }

    // Get current CSS
    getCSS() {
        const doc = this.iframe?.contentDocument;
        const style = doc?.querySelector('style');
        return style?.textContent || '';
    }

    // Get current JS
    getJS() {
        const doc = this.iframe?.contentDocument;
        const script = doc?.querySelector('script:not([src])');
        return script?.textContent || '';
    }

    // Refresh preview
    refresh() {
        const html = this.getHTML();
        const css = this.getCSS();
        const js = this.getJS();
        this.render(html, css, js);
    }

    // Clear preview
    clear() {
        this.writeContent('<!DOCTYPE html><html><head></head><body></body></html>');
    }

    // Get iframe reference
    getIframe() {
        return this.iframe;
    }

    // Focus iframe
    focus() {
        this.iframe?.focus();
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = PreviewSystem;
}