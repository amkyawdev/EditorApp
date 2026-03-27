# Code Analyzer - Analyze code for errors and suggestions
import re

class CodeAnalyzer:
    """Analyze code for potential issues"""
    
    def __init__(self):
        self.errors = []
        self.warnings = []
        self.suggestions = []
    
    def analyze_html(self, code):
        """Analyze HTML code"""
        self.errors = []
        self.warnings = []
        self.suggestions = []
        
        # Check for unclosed tags
        open_tags = re.findall(r'<(\w+)[^>]*(?<!/)>', code)
        close_tags = re.findall(r'</(\w+)>', code)
        
        for tag in open_tags:
            if tag not in ['meta', 'link', 'img', 'br', 'hr', 'input', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr']:
                if close_tags.count(tag) < open_tags.count(tag):
                    self.warnings.append(f"Unclosed <{tag}> tag")
        
        # Check for doctype
        if '<!DOCTYPE' not in code:
            self.suggestions.append("Add DOCTYPE declaration")
        
        # Check for lang attribute
        if 'lang=' not in code:
            self.suggestions.append("Add lang attribute to html tag")
        
        # Check for viewport meta
        if 'viewport' not in code:
            self.suggestions.append("Add viewport meta tag for responsiveness")
        
        return {
            'errors': self.errors,
            'warnings': self.warnings,
            'suggestions': self.suggestions
        }
    
    def analyze_css(self, code):
        """Analyze CSS code"""
        self.errors = []
        self.warnings = []
        self.suggestions = []
        
        # Check for unclosed braces
        open_braces = code.count('{')
        close_braces = code.count('}')
        
        if open_braces != close_braces:
            self.errors.append(f"Unmatched braces: {open_braces} open, {close_braces} close")
        
        # Check for invalid properties
        properties = re.findall(r'([a-z-]+)\s*:', code)
        for prop in properties:
            if prop.startswith('-webkit-') or prop.startswith('-moz-') or prop.startswith('-ms-') or prop.startswith('-o-'):
                self.suggestions.append(f"Consider adding standard version of: {prop}")
        
        # Check for missing semicolons
        lines = code.split('\n')
        for i, line in enumerate(lines):
            line = line.strip()
            if line and not line.startswith('//') and not line.startswith('/*'):
                if not line.endswith(';') and not line.endswith('{') and not line.endswith('}'):
                    if i > 0 and lines[i-1].strip():
                        self.warnings.append(f"Line {i+1}: Missing semicolon")
        
        return {
            'errors': self.errors,
            'warnings': self.warnings,
            'suggestions': self.suggestions
        }
    
    def analyze_js(self, code):
        """Analyze JavaScript code"""
        self.errors = []
        self.warnings = []
        self.suggestions = []
        
        # Check for syntax errors (basic)
        try:
            # Check for unclosed brackets/parens
            open_parens = code.count('(')
            close_parens = code.count(')')
            open_braces = code.count('{')
            close_braces = code.count('}')
            open_brackets = code.count('[')
            close_brackets = code.count(']')
            
            if open_parens != close_parens:
                self.errors.append(f"Unmatched parentheses: {open_parens} open, {close_parens} close")
            if open_braces != close_braces:
                self.errors.append(f"Unmatched braces: {open_braces} open, {close_braces} close")
            if open_brackets != close_brackets:
                self.errors.append(f"Unmatched brackets: {open_brackets} open, {close_brackets} close")
                
        except Exception as e:
            self.errors.append(f"Syntax error: {str(e)}")
        
        # Check for console.log (suggest removing in production)
        if 'console.log' in code:
            self.suggestions.append("Consider removing console.log statements for production")
        
        # Check for eval (security warning)
        if 'eval(' in code:
            self.warnings.append("Using eval() can be a security risk")
        
        return {
            'errors': self.errors,
            'warnings': self.warnings,
            'suggestions': self.suggestions
        }
    
    def get_line_count(self, code):
        """Get line count"""
        return len(code.split('\n'))
    
    def get_character_count(self, code):
        """Get character count"""
        return len(code)