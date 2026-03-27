import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'amkyawdev-secret-key'
    PROJECTS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'projects')
    DEBUG = True
    PORT = 5000
    HOST = '0.0.0.0'
