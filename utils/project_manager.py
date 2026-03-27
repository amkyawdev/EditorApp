# Project Manager - Handle project operations
import os
import shutil
import json
from datetime import datetime

class ProjectManager:
    """Manage projects for the editor"""
    
    def __init__(self, projects_dir):
        self.projects_dir = projects_dir
        self.projects_file = os.path.join(projects_dir, 'projects.json')
        
    def get_projects(self):
        """Get list of all projects"""
        if not os.path.exists(self.projects_dir):
            return ['default']
        
        projects = []
        for item in os.listdir(self.projects_dir):
            item_path = os.path.join(self.projects_dir, item)
            if os.path.isdir(item_path) and not item.startswith('.'):
                projects.append(item)
        
        return projects if projects else ['default']
    
    def get_project_info(self, project_name):
        """Get project information"""
        project_path = os.path.join(self.projects_dir, project_name)
        
        if not os.path.exists(project_path):
            return None
        
        # Get file count
        file_count = len([f for f in os.listdir(project_path) if os.path.isfile(os.path.join(project_path, f))])
        
        # Get creation time
        created = datetime.fromtimestamp(os.path.getctime(project_path))
        
        return {
            'name': project_name,
            'path': project_path,
            'files': file_count,
            'created': created.strftime('%Y-%m-%d'),
            'modified': datetime.fromtimestamp(os.path.getmtime(project_path)).strftime('%Y-%m-%d')
        }
    
    def create_project(self, project_name):
        """Create a new project"""
        project_path = os.path.join(self.projects_dir, project_name)
        
        if os.path.exists(project_path):
            raise Exception(f"Project '{project_name}' already exists")
        
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
        
        return True
    
    def delete_project(self, project_name):
        """Delete a project"""
        if project_name == 'default':
            raise Exception("Cannot delete default project")
        
        project_path = os.path.join(self.projects_dir, project_name)
        
        if not os.path.exists(project_path):
            return False
        
        shutil.rmtree(project_path)
        return True
    
    def rename_project(self, old_name, new_name):
        """Rename a project"""
        old_path = os.path.join(self.projects_dir, old_name)
        new_path = os.path.join(self.projects_dir, new_name)
        
        if not os.path.exists(old_path):
            return False
        
        if os.path.exists(new_path):
            raise Exception(f"Project '{new_name}' already exists")
        
        os.rename(old_path, new_path)
        return True
    
    def duplicate_project(self, source_name, new_name):
        """Duplicate a project"""
        source_path = os.path.join(self.projects_dir, source_name)
        new_path = os.path.join(self.projects_dir, new_name)
        
        if not os.path.exists(source_path):
            return False
        
        if os.path.exists(new_path):
            raise Exception(f"Project '{new_name}' already exists")
        
        shutil.copytree(source_path, new_path)
        return True
    
    def export_project(self, project_name, export_path):
        """Export project as zip"""
        project_path = os.path.join(self.projects_dir, project_name)
        
        if not os.path.exists(project_path):
            return False
        
        shutil.make_archive(export_path, 'zip', project_path)
        return True