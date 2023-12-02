import {useState, useEffect} from 'react'
import './App.css';

const APT_BASE = "http://localhost:3001"

function App() {

  const [todos, setTodos] = useState([])
  const [showPopup, setShowPopup] = useState(false)
  const [newTodo, setNewTodo] = useState('')

  useEffect(() => {
    getTodos();
    // console.log(todos)
  },[])

  const getTodos = async () => {
    const response = await fetch(APT_BASE+"/todos")
    const result = await response.json()
    // console.log(result[0])
    setTodos(result)
  }

  const completeTodo = async (id) => {
    const response = await fetch(APT_BASE+"/todo/complete/"+id, {method: "PUT"})
    const data = await response.json()

    const modifiedTodos = todos.map((todo) => {
      if(todo._id === data._id){
        todo.completed = data.completed
      }
      return todo
    })
    setTodos(modifiedTodos)
    // console.log(todos)
  }

  const deleteTodo = async (id) => {
    const response = await fetch(APT_BASE+"/todo/delete/"+id, {method: "DELETE"})
    const data = await response.json()

    const modifiedTodos = todos.filter(todo => todo._id !== data._id)
    setTodos(modifiedTodos)
  }

  const addTodo = async () => {
      const response = await fetch(APT_BASE+"/todo/new", {
        method: "POST",
        headers: {
          "Content-type" : "application/json"
        },
        body: JSON.stringify({
          task : newTodo
        })
      })
      const data = await response.json()
      setTodos([...todos, data])
      setShowPopup(false)
      setNewTodo('')

  }

  return (
    <div className='App'>
      <h1>Welcome, Gangadhar</h1>
      <h4>Your Tasks</h4>

      <div className='todos'>
        {
          todos.map((todo) => {
            return (
            <div className={'todo ' + (todo.completed ? 'is-complete' : '')} key={todo._id}>
          
              <div className='checkbox' onClick={() => completeTodo(todo._id)}></div>

              <div className='text'>{todo.task}</div>

              <div className='delete-todo' onClick={() => deleteTodo(todo._id)}>x</div>
            </div>
            )
          })
        }

      </div>

      <div className='addPopup' onClick={() => setShowPopup(true)}>+</div>
      {
        showPopup ? (
        <div className='popup'>
          <div className='closePopup' onClick={() => setShowPopup(false)}>X</div>
          <div className='content'>
            <h3>Add Task</h3>
            <input type="text" className='add-todo-input' value={newTodo} onChange={(e) => setNewTodo(e.target.value)}/>
          </div>
          <div className='button' onClick={addTodo}>Add Task</div>
        </div>
        ) : ''
      }

    </div>
  );
}

export default App;
