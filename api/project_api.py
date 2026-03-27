# Project API - Handle project operations
from flask import Blueprint, request, jsonify
import os
import shutil

project_bp = Blueprint('project', __name__)

PROJECTS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'projects')

@project_bp.route('/', methods=['GET'])
def get_projects():
    """Get list of all projects"""
    if not os.path.exists(PROJECTS_DIR):
        return jsonify(['default'])
    
    projects = []
    for item in os.listdir(PROJECTS_DIR):
        item_path = os.path.join(PROJECTS_DIR, item)
        if os.path.isdir(item_path) and not item.startswith('.'):
            projects.append(item)
    
    return jsonify(projects if projects else ['default'])

@project_bp.route('/<project_name>', methods=['GET'])
def get_project(project_name):
    """Get project details"""
    project_path = os.path.join(PROJECTS_DIR, project_name)
    
    if not os.path.exists(project_path):
        return jsonify({'error': 'Project not found'}), 404
    
    files = []
    for f in os.listdir(project_path):
        if os.path.isfile(os.path.join(project_path, f)):
            files.append({'name': f, 'type': get_file_type(f)})
    
    return jsonify({
        'name': project_name,
        'files': files
    })

@project_bp.route('/<project_name>/files', methods=['GET'])
def get_project_files(project_name):
    """Get files in a project"""
    project_path = os.path.join(PROJECTS_DIR, project_name)
    
    if not os.path.exists(project_path):
        return jsonify({'error': 'Project not found'}), 404
    
    files = []
    for root, dirs, filenames in os.walk(project_path):
        for filename in filenames:
            full_path = os.path.join(root, filename)
            rel_path = os.path.relpath(full_path, project_path)
            files.append({
                'name': rel_path,
                'path': rel_path,
                'type': get_file_type(filename)
            })
    
    return jsonify({'files': files})

@project_bp.route('/create', methods=['POST'])
def create_project():
    """Create a new project"""
    data = request.get_json()
    project_name = data.get('name')
    
    if not project_name:
        return jsonify({'error': 'Project name required'}), 400
    
    project_path = os.path.join(PROJECTS_DIR, project_name)
    
    if os.path.exists(project_path):
        return jsonify({'error': 'Project already exists'}), 400
    
    os.makedirs(project_path)
    
    # Create default files
    default_files = {
        'index.html': '<!DOCTYPE html>\n<html>\n<head>\n    <title>New Project</title>\n    <link rel="stylesheet" href="style.css">\n</head>\n<body>\n    <h1>Hello World!</h1>\n    <script src="script.js"></script>\n</body>\n</html>',
        'style.css': '/* Styles */\nbody {\n    font-family: sans-serif;\n    padding: 20px;\n}',
        'script.js': '// JavaScript\nconsole.log("Hello!");'
    }
    
    for filename, content in default_files.items():
        with open(os.path.join(project_path, filename), 'w') as f:
            f.write(content)
    
    return jsonify({'success': True, 'name': project_name})

@project_bp.route('/<project_name>/delete', methods=['DELETE'])
def delete_project(project_name):
    """Delete a project"""
    if project_name == 'default':
        return jsonify({'error': 'Cannot delete default project'}), 400
    
    project_path = os.path.join(PROJECTS_DIR, project_name)
    
    if not os.path.exists(project_path):
        return jsonify({'error': 'Project not found'}), 404
    
    try:
        shutil.rmtree(project_path)
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def get_file_type(filename):
    """Get file type based on extension"""
    ext = filename.split('.')[-1].lower()
    types = {
        'html': 'html',
        'css': 'css',
        'js': 'javascript',
        'json': 'json',
        'md': 'markdown',
        'txt': 'text'
    }
    return types.get(ext, 'text')