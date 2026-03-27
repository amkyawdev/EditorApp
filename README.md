# 🎨 AmkyawDev EditorApp

<p align="center">
  <img src="https://img.shields.io/badge/Version-1.0.0-blue.svg" alt="Version">
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License">
  <img src="https://img.shields.io/badge/Python-Flask-orange.svg" alt="Flask">
  <img src="https://img.shields.io/badge/Status-Active-success.svg" alt="Status">
</p>

A powerful, beautiful, and mobile-responsive web-based code editor built with Flask and modern JavaScript.

---

## ✨ Features

### 🎯 Core Features
- **Smart Code Editor** - Syntax highlighting for HTML, CSS, and JavaScript
- **Live Preview** - See your changes instantly in real-time
- **File Management** - Create, edit, and manage multiple files
- **Project Support** - Work with multiple projects
- **Code Analysis** - Detect errors, warnings, and get suggestions
- **Code Formatter** - Beautify and minify your code
- **Auto-complete** - Intelligent code completion

### 🎨 UI/UX Design
- Beautiful dark theme with cyan accent colors
- Glass morphism effects and animated backgrounds
- Custom 3D transforms and smooth animations
- Modern and clean interface

### 📱 Mobile Responsive
- Fully responsive design that works on all devices
- Touch gesture support (swipe, scroll)
- Mobile-friendly navigation

### ⚡ Smooth JavaScript System
- Smooth scroll animations
- Parallax effects
- Fade in/out transitions
- Touch gestures support

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/amkyawdev/EditorApp.git
cd EditorApp
```

2. **Create virtual environment (optional but recommended):**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Run the application:**
```bash
python app.py
```

5. **Open your browser:**
```
http://localhost:5000
```

---

## 📁 Project Structure

```
EditorApp/
├── app.py                      # Flask Main Application
├── requirements.txt            # Python Dependencies
├── config.py                   # Configuration Settings
├── .env                        # Environment Variables
│
├── static/
│   ├── css/
│   │   ├── style.css          # Main Styles
│   │   ├── editing.css        # Editor Styles
│   │   ├── transforms.css     # 3D Transforms
│   │   └── about.css          # About Page Styles
│   ├── js/
│   │   ├── app.js             # Main Frontend Logic
│   │   ├── advancedFileSystem.js
│   │   ├── smoothsystem.js
│   │   └── about.js
│   ├── components/
│   │   ├── htmlEditor.js
│   │   ├── cssEditor.js
│   │   ├── jsEditor.js
│   │   └── previewSystem.js
│   └── assets/
│       └── icons/
│           └── favicon.ico
│
├── templates/
│   ├── index.html             # Loader Page
│   ├── main.html              # Main Editor
│   ├── editing-page.html      # Advanced Editor
│   └── about.html             # About Page
│
├── projects/                   # User Projects Storage
│   └── default/
│       ├── index.html
│       ├── style.css
│       └── script.js
│
├── utils/
│   ├── __init__.py
│   ├── file_manager.py        # File Operations
│   ├── project_manager.py     # Project Management
│   ├── code_analyzer.py       # Code Analysis
│   └── formatter.py           # Code Formatter
│
├── api/
│   ├── __init__.py
│   ├── file_api.py            # File API Endpoints
│   ├── project_api.py         # Project API Endpoints
│   └── editor_api.py          # Editor API Endpoints
│
└── models/
    ├── __init__.py
    ├── project.py             # Project Model
    └── file.py                # File Model
```

---

## 🔌 API Endpoints

### Health Check
```http
GET /api/health
```

### File Operations
```http
GET  /api/files/read?path=filename&project=projectname
POST /api/files/save
POST /api/files/create
DELETE /api/files/delete
```

### Project Operations
```http
GET    /api/projects/
GET    /api/projects/<project_name>
GET    /api/projects/<project_name>/files
POST   /api/projects/create
DELETE /api/projects/<project_name>/delete
```

### Editor Operations
```http
POST /api/editor/analyze
POST /api/editor/format
POST /api/editor/minify
POST /api/editor/autocomplete
GET  /api/editor/shortcuts
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + S` | Save file |
| `Ctrl + Z` | Undo |
| `Ctrl + Y` | Redo |
| `Ctrl + F` | Find |
| `Ctrl + H` | Find and replace |
| `Ctrl + /` | Toggle comment |
| `Tab` | Indent |
| `Shift + Tab` | Outdent |
| `Ctrl + Space` | Autocomplete |

---

## 🛠️ Technologies Used

### Backend
- **Flask** - Web framework
- **Python** - Programming language
- **python-dotenv** - Environment variables

### Frontend
- **HTML5** - Markup
- **CSS3** - Styling (including 3D transforms)
- **JavaScript (ES6+)** - Client-side logic

### Tools
- **Git** - Version control
- **GitHub** - Hosting

---

## 📸 Screenshots

### Dashboard Page
Modern dashboard with feature cards and smooth animations.

### Editor Page
Full-featured code editor with:
- File tree sidebar
- Multiple file tabs
- Code editor with line numbers
- Live preview panel
- Toolbar with actions

### About Page
Developer profile with:
- Social links
- Statistics
- Timeline
- Skills grid

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Developer

**AmkyawDev** - Full Stack Developer & UI/UX Designer

- GitHub: [@amkyawdev](https://github.com/amkyawdev)
- Email: amkyawdev@example.com

---

## 🙏 Acknowledgments

- Thanks to all contributors
- Inspired by modern code editors
- Built with ❤️

---

<p align="center">Made with ❤️ by <a href="https://github.com/amkyawdev">AmkyawDev</a></p>

<p align="center">
  <img src="https://komarev.com/ghpvc/?username=amkyawdev&label=Views&color=00d4ff&style=flat-square" alt="Profile Views">
</p>