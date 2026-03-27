import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    PORT = int(os.getenv('PORT', 5000))
    FLASK_DEBUG = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    
    # Project paths
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    PROJECTS_DIR = os.path.join(BASE_DIR, 'projects')
    
    # Editor settings
    MAX_FILE_SIZE = 1024 * 1024  # 1MB
    ALLOWED_EXTENSIONS = {'html', 'css', 'js', 'txt', 'json', 'md'}
    
    # UI settings
    THEME = os.getenv('THEME', 'dark')
    ACCENT_COLOR = os.getenv('ACCENT_COLOR', '#00d4ff')

class Development(Config):
    DEBUG = True

class Production(Config):
    DEBUG = False

config = {
    'development': Development,
    'production': Production,
    'default': Development
}