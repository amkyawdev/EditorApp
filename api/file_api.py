# File API - Handle file operations
from flask import Blueprint, request, jsonify
import os

file_bp = Blueprint('file', __name__)

PROJECTS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'projects')

@file_bp.route('/read', methods=['GET'])
def read_file():
    """Read a file from a project"""
    filename = request.args.get('path')
    project = request.args.get('project', 'default')
    
    if not filename:
        return jsonify({'error': 'Filename required'}), 400
    
    file_path = os.path.join(PROJECTS_DIR, project, filename)
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        return jsonify({'content': content, 'path': filename})
    except FileNotFoundError:
        return jsonify({'error': 'File not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@file_bp.route('/save', methods=['POST'])
def save_file():
    """Save content to a file"""
    data = request.get_json()
    
    filename = data.get('path')
    content = data.get('content', '')
    project = data.get('project', 'default')
    
    if not filename:
        return jsonify({'error': 'Filename required'}), 400
    
    file_path = os.path.join(PROJECTS_DIR, project, filename)
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    
    try:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return jsonify({'success': True, 'path': filename})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@file_bp.route('/delete', methods=['DELETE'])
def delete_file():
    """Delete a file"""
    data = request.get_json()
    
    filename = data.get('path')
    project = data.get('project', 'default')
    
    if not filename:
        return jsonify({'error': 'Filename required'}), 400
    
    file_path = os.path.join(PROJECTS_DIR, project, filename)
    
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            return jsonify({'success': True})
        return jsonify({'error': 'File not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@file_bp.route('/create', methods=['POST'])
def create_file():
    """Create a new file"""
    data = request.get_json()
    
    filename = data.get('path')
    content = data.get('content', '')
    project = data.get('project', 'default')
    
    if not filename:
        return jsonify({'error': 'Filename required'}), 400
    
    file_path = os.path.join(PROJECTS_DIR, project, filename)
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    
    try:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return jsonify({'success': True, 'path': filename})
    except Exception as e:
        return jsonify({'error': str(e)}), 500