import os
import shutil
from config import Config

class ProjectManager:
    @staticmethod
    def list_projects():
        if not os.path.exists(Config.PROJECTS_DIR):
            os.makedirs(Config.PROJECTS_DIR)
        return [d for d in os.listdir(Config.PROJECTS_DIR) if os.path.isdir(os.path.join(Config.PROJECTS_DIR, d))]

    @staticmethod
    def create_project(name):
        project_path = os.path.join(Config.PROJECTS_DIR, name)
        if os.path.exists(project_path):
            return False, "Project already exists"
        
        os.makedirs(project_path)
        # Create default files
        with open(os.path.join(project_path, 'index.html'), 'w') as f:
            f.write('<!DOCTYPE html>\n<html>\n<head>\n<title>New Project</title>\n<link rel="stylesheet" href="style.css">\n</head>\n<body>\n<h1>Hello World</h1>\n<script src="script.js"></script>\n</body>\n</html>')
        with open(os.path.join(project_path, 'style.css'), 'w') as f:
            f.write('body { font-family: sans-serif; }')
        with open(os.path.join(project_path, 'script.js'), 'w') as f:
            f.write('console.log("Hello from script.js");')
        
        return True, "Project created successfully"

    @staticmethod
    def delete_project(name):
        project_path = os.path.join(Config.PROJECTS_DIR, name)
        if os.path.exists(project_path):
            shutil.rmtree(project_path)
            return True
        return False
