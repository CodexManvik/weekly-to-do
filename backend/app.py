import os
import requests
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///weektodo.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
CORS(app)
db = SQLAlchemy(app)

# Models
class CustomList(db.Model):
    __tablename__ = 'custom_lists'
    id = db.Column(db.String, primary_key=True)
    name = db.Column(db.String, nullable=False)
    color = db.Column(db.String, nullable=False)
    tasks = db.relationship('Task', backref='custom_list', cascade="all, delete-orphan", lazy=True)

class Task(db.Model):
    __tablename__ = 'tasks'
    id = db.Column(db.String, primary_key=True)
    title = db.Column(db.String, nullable=False)
    completed = db.Column(db.Boolean, default=False)
    date = db.Column(db.String, nullable=False)
    time = db.Column(db.String, nullable=True)
    color = db.Column(db.String, nullable=False)
    recurring = db.Column(db.String, nullable=True)
    list_id = db.Column(db.String, db.ForeignKey('custom_lists.id'), nullable=True)
    reminder = db.Column(db.String, nullable=True)
    priority = db.Column(db.String, nullable=True)

def to_dict_task(task):
    return {
        'id': task.id,
        'title': task.title,
        'completed': task.completed,
        'date': task.date,
        'time': task.time,
        'color': task.color,
        'recurring': task.recurring,
        'listId': task.list_id,
        'reminder': task.reminder,
        'priority': task.priority,
    }

def to_dict_list(clist):
    return {
        'id': clist.id,
        'name': clist.name,
        'color': clist.color,
        'tasks': [to_dict_task(t) for t in clist.tasks]
    }

with app.app_context():
    db.create_all()


# Home route
@app.route('/')
def home():
    return jsonify({'message': 'Backend is running!'})


# --- TASKS API ---
@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    all_tasks = Task.query.filter_by(list_id=None).all()
    return jsonify([to_dict_task(t) for t in all_tasks])

@app.route('/api/tasks', methods=['POST'])
def add_task():
    data = request.json or {}
    import time
    new_id = str(int(time.time() * 1000))
    task = Task()
    task.id = new_id
    task.title = data.get('title', '')
    task.completed = data.get('completed', False)
    task.date = data.get('date', '')
    task.time = data.get('time')
    task.color = data.get('color', 'blue')
    task.recurring = data.get('recurring')
    task.list_id = None
    task.reminder = data.get('reminder')
    task.priority = data.get('priority')
    db.session.add(task)
    db.session.commit()
    return jsonify(to_dict_task(task)), 201

@app.route('/api/tasks/<task_id>', methods=['PUT'])
def update_task(task_id):
    data = request.json or {}
    task = Task.query.get(task_id)
    if not task:
        return jsonify({'error': 'Task not found'}), 404
    for key in ['title', 'completed', 'date', 'time', 'color', 'recurring', 'reminder', 'priority']:
        if key in data:
            setattr(task, key, data[key])
    # Handle listId separately to map to list_id
    if 'listId' in data:
        task.list_id = data['listId']
    db.session.commit()
    return jsonify(to_dict_task(task))

@app.route('/api/tasks/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    task = Task.query.get(task_id)
    if not task:
        return '', 204
    db.session.delete(task)
    db.session.commit()
    return '', 204


# --- CUSTOM LISTS API ---
@app.route('/api/lists', methods=['GET'])
def get_lists():
    lists = CustomList.query.all()
    return jsonify([to_dict_list(l) for l in lists])

@app.route('/api/lists', methods=['POST'])
def add_list():
    data = request.json or {}
    import time
    new_id = str(int(time.time() * 1000))
    clist = CustomList()
    clist.id = new_id
    clist.name = data.get('name', '')
    clist.color = data.get('color', 'bg-gradient-to-r from-blue-500 to-purple-500')
    db.session.add(clist)
    db.session.commit()
    return jsonify(to_dict_list(clist)), 201

@app.route('/api/lists/<list_id>', methods=['DELETE'])
def delete_list(list_id):
    clist = CustomList.query.get(list_id)
    if not clist:
        return '', 204
    db.session.delete(clist)
    db.session.commit()
    return '', 204

@app.route('/api/lists/<list_id>/tasks', methods=['POST'])
def add_task_to_list(list_id):
    data = request.json or {}
    clist = CustomList.query.get(list_id)
    if not clist:
        return jsonify({'error': 'List not found'}), 404
    import time
    new_id = str(int(time.time() * 1000))
    task = Task()
    task.id = new_id
    task.title = data.get('title', '')
    task.completed = data.get('completed', False)
    task.date = data.get('date', '')
    task.time = data.get('time')
    task.color = data.get('color', 'blue')
    task.recurring = data.get('recurring')
    task.list_id = list_id
    task.reminder = data.get('reminder')
    task.priority = data.get('priority')
    db.session.add(task)
    db.session.commit()
    return jsonify(to_dict_task(task)), 201

@app.route('/api/lists/<list_id>/tasks/<task_id>/move', methods=['POST'])
def move_task_to_list(list_id, task_id):
    clist = CustomList.query.get(list_id)
    task = Task.query.get(task_id)
    if not clist or not task:
        return jsonify({'error': 'Task or List not found'}), 404
    task.list_id = list_id
    db.session.commit()
    return jsonify(to_dict_task(task))

# --- AI CHAT API ---
@app.route('/api/ai/chat', methods=['POST'])
def ai_chat():
    data = request.json or {}
    user_message = data.get('message', '')
    
    if not user_message:
        return jsonify({'error': 'Message is required'}), 400
    
    ai_api_key = os.getenv('AI_API_KEY')
    if not ai_api_key:
        return jsonify({'error': 'AI API key not configured'}), 500
    
    try:
        # Using OpenAI API (you can change this to other AI providers)
        headers = {
            'Authorization': f'Bearer {ai_api_key}',
            'Content-Type': 'application/json'
        }
        
        # Create a system prompt for task breakdown
        system_prompt = """You are a helpful AI assistant that helps users break down complex tasks into smaller, manageable to-do items. 
        When users describe a task or goal, analyze it and suggest 3-5 specific, actionable subtasks that would help accomplish their goal.
        Focus on practical, actionable items that can be completed in a reasonable timeframe.
        Return your response in this format:
        {
            "message": "Your helpful response explaining the breakdown",
            "tasks": ["Task 1", "Task 2", "Task 3", "Task 4", "Task 5"]
        }"""
        
        payload = {
            'model': 'gpt-3.5-turbo',
            'messages': [
                {'role': 'system', 'content': system_prompt},
                {'role': 'user', 'content': user_message}
            ],
            'max_tokens': 500,
            'temperature': 0.7
        }
        
        response = requests.post(
            'https://api.openai.com/v1/chat/completions',
            headers=headers,
            json=payload,
            timeout=30
        )
        
        if response.status_code == 200:
            ai_response = response.json()
            content = ai_response['choices'][0]['message']['content']
            
            # Try to parse the response as JSON, fallback to plain text
            try:
                import json
                parsed_response = json.loads(content)
                return jsonify(parsed_response)
            except json.JSONDecodeError:
                # If not valid JSON, return as plain message
                return jsonify({
                    'message': content,
                    'tasks': []
                })
        else:
            return jsonify({'error': 'AI service unavailable'}), 500
            
    except requests.exceptions.RequestException as e:
        return jsonify({'error': f'AI service error: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': f'Unexpected error: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True)
