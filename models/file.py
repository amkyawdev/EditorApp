# File Model
from datetime import datetime

class File:
    """File model representing a code file"""
    
    def __init__(self, name, path=None, content='', file_type=None, size=0):
        self.name = name
        self.path = path or name
        self.content = content
        self.file_type = file_type or self.get_type_from_name(name)
        self.size = size or len(content)
        self.created = datetime.now()
        self.modified = datetime.now()
    
    def get_type_from_name(self, name):
        """Get file type from filename"""
        ext = name.split('.')[-1].lower() if '.' in name else ''
        types = {
            'html': 'html',
            'htm': 'html',
            'css': 'css',
            'js': 'javascript',
            'json': 'json',
            'md': 'markdown',
            'txt': 'text',
            'py': 'python',
            'rb': 'ruby',
            'php': 'php'
        }
        return types.get(ext, 'text')
    
    def to_dict(self):
        """Convert file to dictionary"""
        return {
            'name': self.name,
            'path': self.path,
            'type': self.file_type,
            'size': self.size,
            'created': self.created.isoformat() if isinstance(self.created, datetime) else self.created,
            'modified': self.modified.isoformat() if isinstance(self.modified, datetime) else self.modified
        }
    
    @classmethod
    def from_dict(cls, data):
        """Create file from dictionary"""
        return cls(
            name=data.get('name'),
            path=data.get('path'),
            content=data.get('content', ''),
            file_type=data.get('type'),
            size=data.get('size', 0)
        )
    
    def update_content(self, content):
        """Update file content"""
        self.content = content
        self.size = len(content)
        self.modified = datetime.now()
    
    def get_content(self):
        """Get file content"""
        return self.content
    
    def __repr__(self):
        return f"File(name='{self.name}', type='{self.file_type}')"