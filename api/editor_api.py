# Editor API - Handle editor operations
from flask import Blueprint, request, jsonify
import os
import json
from utils.code_analyzer import CodeAnalyzer
from utils.formatter import CodeFormatter

editor_bp = Blueprint('editor', __name__)

PROJECTS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'projects')

# Initialize utilities
analyzer = CodeAnalyzer()
formatter = CodeFormatter()

@editor_bp.route('/analyze', methods=['POST'])
def analyze_code():
    """Analyze code for errors and suggestions"""
    data = request.get_json()
    code = data.get('code', '')
    language = data.get('language', 'html')
    
    if language == 'html':
        result = analyzer.analyze_html(code)
    elif language == 'css':
        result = analyzer.analyze_css(code)
    elif language == 'javascript' or language == 'js':
        result = analyzer.analyze_js(code)
    else:
        return jsonify({'error': 'Unsupported language'}), 400
    
    # Add statistics
    result['stats'] = {
        'lines': analyzer.get_line_count(code),
        'characters': analyzer.get_character_count(code)
    }
    
    return jsonify(result)

@editor_bp.route('/format', methods=['POST'])
def format_code():
    """Format code"""
    data = request.get_json()
    code = data.get('code', '')
    language = data.get('language', 'html')
    
    try:
        formatted = formatter.beautify(code, language)
        return jsonify({'code': formatted})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@editor_bp.route('/minify', methods=['POST'])
def minify_code():
    """Minify code"""
    data = request.get_json()
    code = data.get('code', '')
    language = data.get('language', 'html')
    
    try:
        minified = formatter.minify(code, language)
        return jsonify({
            'code': minified,
            'original_size': len(code),
            'minified_size': len(minified),
            'saved': len(code) - len(minified)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@editor_bp.route('/autocomplete', methods=['POST'])
def autocomplete():
    """Get autocomplete suggestions"""
    data = request.get_json()
    code = data.get('code', '')
    language = data.get('language', 'html')
    cursor = data.get('cursor', 0)
    
    suggestions = []
    
    if language == 'html':
        suggestions = get_html_suggestions(code, cursor)
    elif language == 'css':
        suggestions = get_css_suggestions(code, cursor)
    elif language == 'javascript':
        suggestions = get_js_suggestions(code, cursor)
    
    return jsonify({'suggestions': suggestions})

def get_html_suggestions(code, cursor):
    """Get HTML autocomplete suggestions"""
    suggestions = []
    
    # Common HTML tags
    tags = ['div', 'span', 'p', 'a', 'img', 'ul', 'ol', 'li', 'table', 'form', 'input', 'button', 'h1', 'h2', 'h3', 'header', 'footer', 'nav', 'main', 'section', 'article']
    
    # Get current word
    text_before = code[:cursor]
    current_word = text_before.split('<')[-1].split()[-1] if '<' in text_before else ''
    
    for tag in tags:
        if tag.startswith(current_word.lower()):
            suggestions.append({
                'label': f'<{tag}>',
                'insert': f'<{tag}></{tag}>'
            })
    
    return suggestions

def get_css_suggestions(code, cursor):
    """Get CSS autocomplete suggestions"""
    suggestions = []
    
    properties = [
        'color', 'background', 'margin', 'padding', 'border', 'width', 'height',
        'display', 'position', 'top', 'right', 'bottom', 'left', 'font-size',
        'font-family', 'text-align', 'flex', 'grid', 'animation'
    ]
    
    # Get current word
    text_before = code[:cursor]
    current_word = text_before.split(':')[-1].strip().split()[-1] if ':' in text_before else ''
    
    for prop in properties:
        if prop.startswith(current_word.lower()):
            suggestions.append({
                'label': prop,
                'insert': f'{prop}: '
            })
    
    return suggestions

def get_js_suggestions(code, cursor):
    """Get JavaScript autocomplete suggestions"""
    suggestions = []
    
    keywords = ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'class', 'async', 'await']
    
    # Get current word
    text_before = code[:cursor]
    current_word = text_before.split()[-1] if text_before.split() else ''
    
    for keyword in keywords:
        if keyword.startswith(current_word.lower()):
            suggestions.append({
                'label': keyword,
                'insert': keyword + ' '
            })
    
    return suggestions

@editor_bp.route('/shortcuts', methods=['GET'])
def get_shortcuts():
    """Get keyboard shortcuts"""
    shortcuts = [
        {'key': 'Ctrl+S', 'action': 'Save file'},
        {'key': 'Ctrl+Z', 'action': 'Undo'},
        {'key': 'Ctrl+Y', 'action': 'Redo'},
        {'key': 'Ctrl+F', 'action': 'Find'},
        {'key': 'Ctrl+H', 'action': 'Find and replace'},
        {'key': 'Ctrl+/', 'action': 'Toggle comment'},
        {'key': 'Tab', 'action': 'Indent'},
        {'key': 'Shift+Tab', 'action': 'Outdent'},
        {'key': 'Ctrl+Space', 'action': 'Autocomplete'},
    ]
    return jsonify(shortcuts)