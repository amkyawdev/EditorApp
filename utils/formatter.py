# Code Formatter - Format code for better readability
import re

class CodeFormatter:
    """Format code for better readability"""
    
    def __init__(self):
        self.indent_size = 2
        
    def format_html(self, code):
        """Format HTML code"""
        # Add newlines after closing tags
        code = re.sub(r'(</\w+>)', r'\1\n', code)
        
        # Indent nested elements
        lines = code.split('\n')
        formatted_lines = []
        indent_level = 0
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
                
            # Decrease indent before closing tags
            if line.startswith('</'):
                indent_level = max(0, indent_level - 1)
            
            # Add indent
            formatted_lines.append(' ' * (indent_level * self.indent_size) + line)
            
            # Increase indent after opening tags (non-self-closing)
            if line.startswith('<') and not line.startswith('<!') and not line.endswith('/>') and not line.startswith('</'):
                # Check if it's not a void element
                tag = re.search(r'<(\w+)', line)
                if tag:
                    tag_name = tag.group(1)
                    if tag_name not in ['meta', 'link', 'img', 'br', 'hr', 'input', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr']:
                        indent_level += 1
        
        return '\n'.join(formatted_lines)
    
    def format_css(self, code):
        """Format CSS code"""
        # Remove comments
        code = re.sub(r'/\*.*?\*/', '', code, flags=re.DOTALL)
        
        # Add newlines after closing braces
        code = re.sub(r'}', '}\n', code)
        
        # Format properties
        lines = code.split('\n')
        formatted_lines = []
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
                
            # Add space after property colon
            line = re.sub(r'([^:]+):(.+)', r'\1: \2', line)
            formatted_lines.append(line)
        
        return '\n'.join(formatted_lines)
    
    def format_js(self, code):
        """Format JavaScript code"""
        # Add space after keywords
        keywords = ['if', 'else', 'for', 'while', 'do', 'switch', 'try', 'catch', 'finally', 'function', 'return', 'throw']
        for keyword in keywords:
            code = re.sub(rf'\b({keyword})\(', rf'\1 (', code)
        
        # Add newlines after closing braces (except in if/for statements)
        lines = []
        for line in code.split('\n'):
            line = line.strip()
            if not line:
                continue
            
            # Preserve inline blocks
            if line.endswith('}') and not line.endswith('{}'):
                line += '\n'
            
            lines.append(line)
        
        # Join with proper spacing
        formatted = []
        for i, line in enumerate(lines):
            if line == '}':
                if formatted and formatted[-1].strip():
                    formatted.append('')
            formatted.append(line)
        
        return '\n'.join(formatted)
    
    def minify_html(self, code):
        """Minify HTML code"""
        # Remove comments
        code = re.sub(r'<!--.*?-->', '', code, flags=re.DOTALL)
        
        # Remove whitespace between tags
        code = re.sub(r'>\s+<', '><', code)
        
        # Remove extra whitespace
        code = re.sub(r'\s+', ' ', code)
        
        return code.strip()
    
    def minify_css(self, code):
        """Minify CSS code"""
        # Remove comments
        code = re.sub(r'/\*.*?\*/', '', code, flags=re.DOTALL)
        
        # Remove whitespace
        code = re.sub(r'\s+', ' ', code)
        
        # Remove whitespace around special chars
        code = re.sub(r'\s*([{}:;,])\s*', r'\1', code)
        
        return code.strip()
    
    def minify_js(self, code):
        """Minify JavaScript code"""
        # Remove single-line comments
        code = re.sub(r'//.*?$', '', code, flags=re.MULTILINE)
        
        # Remove multi-line comments
        code = re.sub(r'/\*.*?\*/', '', code, flags=re.DOTALL)
        
        # Remove extra whitespace
        code = re.sub(r'\s+', ' ', code)
        
        # Remove whitespace around operators
        code = re.sub(r'\s*([+\-*/%=<>!&|^~?:])\s*', r'\1', code)
        
        return code.strip()
    
    def beautify(self, code, language='html'):
        """Beautify code based on language"""
        if language == 'html':
            return self.format_html(code)
        elif language == 'css':
            return self.format_css(code)
        elif language == 'javascript' or language == 'js':
            return self.format_js(code)
        return code
    
    def minify(self, code, language='html'):
        """Minify code based on language"""
        if language == 'html':
            return self.minify_html(code)
        elif language == 'css':
            return self.minify_css(code)
        elif language == 'javascript' or language == 'js':
            return self.minify_js(code)
        return code