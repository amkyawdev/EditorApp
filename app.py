from flask import Flask, render_template, jsonify, request, send_from_directory
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['PROJECTS_DIR'] = os.path.join(os.path.dirname(__file__), 'projects')

# Import blueprints
from api.file_api import file_bp
from api.project_api import project_bp
from api.editor_api import editor_bp

# Register blueprints
app.register_blueprint(file_bp, url_prefix='/api/files')
app.register_blueprint(project_bp, url_prefix='/api/projects')
app.register_blueprint(editor_bp, url_prefix='/api/editor')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/main')
def main():
    return render_template('main.html')

@app.route('/editor')
def editor():
    return render_template('editing-page.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory('static', filename)

@app.route('/projects/<path:filename>')
def serve_projects(filename):
    return send_from_directory('projects', filename)

@app.route('/api/health')
def health():
    return jsonify({'status': 'ok', 'message': 'AmkyawDev EditorApp running'})

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    app.run(host='0.0.0.0', port=port, debug=debug)