# File Manager - Handle file operations
import os
import json
from pathlib import Path

class FileManager:
    """Manage file operations for the editor"""
    
    def __init__(self, projects_dir):
        self.projects_dir = projects_dir
        
    def read_file(self, project, filename):
        """Read a file from a project"""
        file_path = os.path.join(self.projects_dir, project, filename)
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return f.read()
        except FileNotFoundError:
            return None
        except Exception as e:
            raise Exception(f"Error reading file: {str(e)}")
    
    def write_file(self, project, filename, content):
        """Write content to a file"""
        file_path = os.path.join(self.projects_dir, project, filename)
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        try:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        except Exception as e:
            raise Exception(f"Error writing file: {str(e)}")
    
    def delete_file(self, project, filename):
        """Delete a file from a project"""
        file_path = os.path.join(self.projects_dir, project, filename)
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
                return True
            return False
        except Exception as e:
            raise Exception(f"Error deleting file: {str(e)}")
    
    def list_files(self, project):
        """List all files in a project"""
        project_path = os.path.join(self.projects_dir, project)
        if not os.path.exists(project_path):
            return []
        
        files = []
        for root, dirs, filenames in os.walk(project_path):
            for filename in filenames:
                rel_path = os.path.relpath(os.path.join(root, filename), project_path)
                files.append({
                    'name': rel_path,
                    'path': rel_path,
                    'type': self.get_file_type(filename)
                })
        return files
    
    def get_file_type(self, filename):
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
    
    def create_file(self, project, filename, content=''):
        """Create a new file"""
        return self.write_file(project, filename, content)
    
    def file_exists(self, project, filename):
        """Check if file exists"""
        file_path = os.path.join(self.projects_dir, project, filename)
        return os.path.exists(file_path)