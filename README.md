# WeekToDo Planner

A modern, AI-powered weekly to-do list planner with drag-and-drop functionality, custom lists, and intelligent task breakdown.

![WeekToDo Planner](https://img.shields.io/badge/Status-Active-brightgreen)
![React](https://img.shields.io/badge/Frontend-React-blue)
![Flask](https://img.shields.io/badge/Backend-Flask-green)
![AI](https://img.shields.io/badge/AI-OpenAI-purple)

## ✨ Features

### 🎯 Core Functionality
- **Weekly Planner**: Organize tasks by day with a beautiful weekly view
- **Drag & Drop**: Seamlessly move tasks between days and custom lists
- **Custom Lists**: Create themed lists for different projects or categories
- **Task Management**: Mark tasks as complete, edit titles, set priorities
- **Responsive Design**: Works perfectly on desktop and mobile devices

### 🤖 AI Assistant
- **Smart Task Breakdown**: AI helps break down complex goals into manageable tasks
- **Natural Language**: Chat with AI using natural language
- **Auto Task Creation**: AI automatically adds suggested tasks to your list
- **Context-Aware**: Understands different types of projects and goals

### 🎨 Modern UI/UX
- **Dark/Light Mode**: Toggle between themes
- **Smooth Animations**: Beautiful transitions and micro-interactions
- **Glass Morphism**: Modern design with backdrop blur effects
- **Intuitive Interface**: Easy-to-use drag-and-drop interface

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- pnpm (recommended) or npm
- OpenAI API key

### 1. Clone the Repository
```bash
git clone <repository-url>
cd weektodo
```

### 2. Install Dependencies

#### Frontend
```bash
cd frontend
pnpm install
```

#### Backend
```bash
cd backend
python -m venv .venv
# On Windows
.venv\Scripts\activate
# On macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt
```

### 3. Environment Setup

Create a `.env` file in the project root:
```env
AI_API_KEY=your_openai_api_key_here
```

### 4. Run the Application

From the project root:
```bash
npm start
```

This will start both the frontend (port 3000) and backend (port 5000) simultaneously.

## 📁 Project Structure

```
weektodo/
├── frontend/                 # React/Next.js frontend
│   ├── app/                 # Next.js app directory
│   ├── components/          # React components
│   │   ├── ui/             # Reusable UI components
│   │   └── ...             # Feature components
│   ├── contexts/           # React contexts
│   └── ...
├── backend/                 # Flask backend
│   ├── app.py              # Main Flask application
│   ├── requirements.txt    # Python dependencies
│   └── instance/          # Database files
├── package.json            # Root package.json for scripts
└── README.md              # This file
```

## 🛠️ Technology Stack

### Frontend
- **Next.js 14**: React framework with app router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **Radix UI**: Accessible component primitives
- **DND Kit**: Drag and drop functionality

### Backend
- **Flask**: Python web framework
- **SQLAlchemy**: Database ORM
- **SQLite**: Lightweight database
- **Flask-CORS**: Cross-origin resource sharing
- **OpenAI API**: AI integration

### AI Integration
- **OpenAI GPT-3.5-turbo**: Natural language processing
- **Structured Responses**: JSON-formatted task breakdowns
- **Error Handling**: Graceful fallbacks

## 🎮 Usage Guide

### Adding Tasks
1. **Quick Add**: Click the "+" button on any day
2. **Drag & Drop**: Drag tasks between days
3. **AI Assistant**: Use the chat button to get AI-generated tasks

### Managing Tasks
- **Complete**: Click the checkbox to mark as done
- **Edit**: Double-click the task title to edit
- **Delete**: Use the trash icon in custom lists
- **Move**: Drag tasks between days and lists

### AI Assistant
1. Click the purple chat button (bottom-right)
2. Describe your goal or project
3. AI will suggest tasks and add them automatically
4. Examples:
   - "Help me plan a trip to Japan"
   - "Break down my website project"
   - "Organize my home office"

### Custom Lists
1. Click "Add New List" in the bottom section
2. Give your list a name and color
3. Add tasks specific to that list
4. Drag tasks between lists and main planner

## 🔧 Development

### Running in Development Mode
```bash
# Terminal 1 - Backend
cd backend
python app.py

# Terminal 2 - Frontend
cd frontend
pnpm dev
```

### Database
The application uses SQLite for simplicity. The database file is created automatically at `backend/instance/weektodo.db`.

### API Endpoints

#### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

#### Lists
- `GET /api/lists` - Get all custom lists
- `POST /api/lists` - Create new list
- `DELETE /api/lists/:id` - Delete list
- `POST /api/lists/:id/tasks` - Add task to list
- `POST /api/lists/:id/tasks/:taskId/move` - Move task to list

#### AI Chat
- `POST /api/ai/chat` - AI chat endpoint

## 🎨 Customization

### Themes
The app supports both light and dark modes. Toggle using the moon icon in the sidebar.

### Colors
Tasks can be assigned different colors:
- Red, Blue, Green, Yellow
- Purple, Pink, Orange, Teal

### AI Prompts
Modify the system prompt in `backend/app.py` to customize AI behavior.

## 🐛 Troubleshooting

### Common Issues

**Frontend not loading**
- Check if port 3000 is available
- Try `pnpm dev` in the frontend directory

**Backend connection errors**
- Ensure Python virtual environment is activated
- Check if port 5000 is available
- Verify all dependencies are installed

**AI chat not working**
- Verify `AI_API_KEY` is set in `.env`
- Check OpenAI API key is valid
- Ensure backend is running on port 5000

**Database issues**
- Delete `backend/instance/weektodo.db` to reset
- Restart the backend application

### Debug Mode
Enable debug logging by setting `DEBUG=True` in the backend.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS
- [OpenAI](https://openai.com/) for the AI capabilities
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [DND Kit](https://dndkit.com/) for drag and drop functionality

---

**Made with ❤️ for productive people everywhere** 