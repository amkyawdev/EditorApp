from flask import Flask, render_template, jsonify, request, send_from_directory
from flask_cors import CORS
import os
from config import Config
from utils.file_manager import FileManager
from utils.project_manager import ProjectManager

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

# Ensure projects directory exists
if not os.path.exists(app.config['PROJECTS_DIR']):
    os.makedirs(app.config['PROJECTS_DIR'])

# --- Routes ---

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/main')
def main_editor():
    return render_template('main.html')

@app.route('/editing')
def editing_page():
    return render_template('editing-page.html')

@app.route('/about')
def about():
    return render_template('about.html')

# --- API Endpoints ---

@app.route('/api/projects', methods=['GET'])
def get_projects():
    projects = ProjectManager.list_projects()
    return jsonify(projects)

@app.route('/api/projects', methods=['POST'])
def create_project():
    data = request.json
    name = data.get('name')
    if not name:
        return jsonify({'error': 'Project name is required'}), 400
    success, message = ProjectManager.create_project(name)
    if success:
        return jsonify({'message': message}), 201
    return jsonify({'error': message}), 400

@app.route('/api/projects/<name>', methods=['DELETE'])
def delete_project(name):
    if ProjectManager.delete_project(name):
        return jsonify({'message': 'Project deleted successfully'})
    return jsonify({'error': 'Project not found'}), 404

@app.route('/api/files/<project_name>', methods=['GET'])
def list_files(project_name):
    project_path = os.path.join(app.config['PROJECTS_DIR'], project_name)
    if not os.path.exists(project_path):
        return jsonify({'error': 'Project not found'}), 404
    files = FileManager.list_files(project_path)
    return jsonify(files)

@app.route('/api/files/<project_name>/<path:file_path>', methods=['GET'])
def get_file_content(project_name, file_path):
    full_path = os.path.join(app.config['PROJECTS_DIR'], project_name, file_path)
    if not os.path.exists(full_path):
        return jsonify({'error': 'File not found'}), 404
    content = FileManager.read_file(full_path)
    return jsonify({'content': content})

@app.route('/api/files/<project_name>/<path:file_path>', methods=['POST'])
def save_file_content(project_name, file_path):
    data = request.json
    content = data.get('content', '')
    full_path = os.path.join(app.config['PROJECTS_DIR'], project_name, file_path)
    if FileManager.write_file(full_path, content):
        return jsonify({'message': 'File saved successfully'})
    return jsonify({'error': 'Failed to save file'}), 500

@app.route('/api/preview/<project_name>/<path:file_path>')
def preview_file(project_name, file_path):
    project_path = os.path.join(app.config['PROJECTS_DIR'], project_name)
    return send_from_directory(project_path, file_path)

if __name__ == '__main__':
    app.run(host=app.config['HOST'], port=app.config['PORT'], debug=app.config['DEBUG'])
