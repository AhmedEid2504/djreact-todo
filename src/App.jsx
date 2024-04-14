import { useState, useEffect } from 'react';
import './App.css'

function App() {
  const [todoList, setTodoList] = useState([]);
  const [activeItem, setActiveItem] = useState({
    id: null,
    title: '',
    completed: false,
  });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);
  //  https://todo-backend-7yrg.onrender.com/api/task-list/
  const fetchTasks = () => {
    fetch('https://todo-backend-7yrg.onrender.com/api/task-list/')
      .then((response) => response.json())
      .then((data) => setTodoList(data));
  };

  const addTask = (task) => {
    fetch('https://todo-backend-7yrg.onrender.com/api/task-create/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    })
    .then((response) => response.json())
    .then((data) => setTodoList([...todoList, data]));
  };

  const updateTask = (id, updatedTask) => {
    fetch(`https://todo-backend-7yrg.onrender.com/api/task-update/${id}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTask),
    })
    .then((response) => response.json())
    .then((data) => setTodoList((currentTodoList) => currentTodoList.map((task) => (task.id === id ? data : task))))
    .catch((error) => console.error('Error:', error));
  };

  const deleteTask = (id) => {
    fetch(`https://todo-backend-7yrg.onrender.com/api/task-delete/${id}/`, {
      method: 'DELETE',
    })
    .then(() => setTodoList((currentTodoList) => currentTodoList.filter((task) => task.id !== id)))
    .catch((error) => console.error('Error:', error));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (editing) {
      updateTask(activeItem.id, activeItem);
      setEditing(false);
    } else {
      addTask(activeItem);
    }
    setActiveItem({
      id: null,
      title: '',
      completed: false,
    });
  };

  const handleChange = (event) => {
    setActiveItem({ ...activeItem, title: event.target.value });
  };

  const editTask = (task) => {
    setActiveItem(task);
    setEditing(true);
  };

    return(
      <div className='container'>
        <div id='task-container'>
          <div id='form-wrapper'>
            <form onSubmit={handleSubmit} id="form">
              <div className="flex-wrapper">
                <div style={{flex: 6}}>
                  <input onChange={handleChange} className="form-control" id="title" type="text" name="title" placeholder="Add task.." value={activeItem.title} />
                </div>

                <div style={{flex: 1}}>
                  <input id="submit" className="btn btn-success" type="submit" name="Add" />
                </div>
              </div>
            </form>
            {todoList.map((task) => (
              <div key={task.id}>
                <span>{task.title}</span>
                <button onClick={() => editTask(task)}>Edit</button>
                <button onClick={() => deleteTask(task.id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

export default App
