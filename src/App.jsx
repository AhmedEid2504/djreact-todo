import { useState, useEffect } from 'react';
import './index.css'

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

  const completeTask = (id) => {
    const updatedTask = todoList.find((task) => task.id === id);
    updatedTask.completed = !updatedTask.completed;
    updateTask(updatedTask.id, updatedTask);
  };

    return(
      <div className='flex justify-center items-center w-full h-screen'>
        <div id='task-container' className='flex justify-center items-center flex-wrap'>
          <div id='form-wrapper' className='flex flex-col flex-wrap'>
            <form onSubmit={handleSubmit} id="form">
              <div className="flex justify-center items-center p-2 flex-wrap">
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
                <div className='flex flex-wrap items-center justify-between p-3 m-2 rounded-md gap-3 border-2 border-slate-500'>
                  <span className='max-sm:w-auto w-56'>{task.title}</span>
                  <div className='flex flex-wrap items-center gap-3 justify-center'>
                    <button className='bg-slate-500 p-1 rounded-md text-white' onClick={() => editTask(task)}>Edit</button>
                    <button className='bg-red-500 p-1 rounded-md text-white' onClick={() => deleteTask(task.id)}>Delete</button>
                    {/* check for  task completion */}
                    {/* if task complete show button that makes completed false else show button that completes it the buttons should be with checkmarks */}
                    <input type="checkbox" className=' cursor-pointer' checked={task.completed} onChange={()=>completeTask(task.id)} />                    
                    
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

export default App
