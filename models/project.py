# Project Model
from datetime import datetime
import os

class Project:
    """Project model representing a coding project"""
    
    def __init__(self, name, path=None, created=None, modified=None):
        self.name = name
        self.path = path or os.path.join('projects', name)
        self.created = created or datetime.now()
        self.modified = modified or datetime.now()
        self.files = []
    
    def to_dict(self):
        """Convert project to dictionary"""
        return {
            'name': self.name,
            'path': self.path,
            'created': self.created.isoformat() if isinstance(self.created, datetime) else self.created,
            'modified': self.modified.isoformat() if isinstance(self.modified, datetime) else self.modified,
            'files': [f.to_dict() for f in self.files]
        }
    
    @classmethod
    def from_dict(cls, data):
        """Create project from dictionary"""
        project = cls(
            name=data.get('name'),
            path=data.get('path'),
            created=data.get('created'),
            modified=data.get('modified')
        )
        return project
    
    def add_file(self, file_obj):
        """Add file to project"""
        self.files.append(file_obj)
        self.modified = datetime.now()
    
    def remove_file(self, filename):
        """Remove file from project"""
        self.files = [f for f in self.files if f.name != filename]
        self.modified = datetime.now()
    
    def get_file(self, filename):
        """Get file by name"""
        for f in self.files:
            if f.name == filename:
                return f
        return None
    
    def __repr__(self):
        return f"Project(name='{self.name}', files={len(self.files)})"