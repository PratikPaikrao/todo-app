import { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { v4 as uuidv4 } from 'uuid';

function App() {

  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [showFinished, setshowFinished] = useState(true);

  // Load todos from localStorage
  useEffect(() => {
    let todoString = localStorage.getItem("todos");
    if (todoString) {
      let todos = JSON.parse(todoString);
      setTodos(todos);
    }
  }, []);

  // Save todos (reusable)
  const saveTols = (data) => {
    localStorage.setItem("todos", JSON.stringify(data));
  };

  const toggleFinished = () => {
    setshowFinished(!showFinished);
  };

  const handleEdit = (e, id) => {
    let t = todos.filter(i => i.id === id);

    if (t.length > 0) {
      setTodo(t[0].todo);
    }

    let newTodos = todos.filter(item => item.id !== id);
    setTodos(newTodos);
    saveTols(newTodos);
  };

  const handleDelete = (e, id) => {
    let newTodos = todos.filter(item => item.id !== id);
    setTodos(newTodos);
    saveTols(newTodos);
  };

  const handlAdd = () => {
    if (todo.trim() === "") return;   // prevent empty todo

    const newTodos = [...todos, { id: uuidv4(), todo, isCompleted: false }];
    setTodos(newTodos);
    setTodo("");
    saveTols(newTodos);
  };

  const handleChange = (e) => {
    setTodo(e.target.value);
  };

  const handleCheckbox = (e) => {
    let id = e.target.name;

    let index = todos.findIndex(item => item.id === id);

    let newTodos = [...todos];
    newTodos[index].isCompleted = !newTodos[index].isCompleted;

    setTodos(newTodos);
    saveTols(newTodos);   // FIXED (important)
  };

  return (
    <>
      <Navbar />
      <div className='mx-3 md:container md:mx-auto my-5 rounded-xl bg-violet-300 min-h-[80vh] md:w-1/2 p-2'>

        <h1 className='font-bold text-center text-xl'>
          iTask - Manage your todos at one place
        </h1>

        {/* Add Todo */}
        <div className="addTodo my-5 flex flex-col gap-4">
          <h2 className='text-lg font-bold'>Add a Todo</h2>

          <div className="flex gap-4">
            <input
              onChange={handleChange}
              value={todo}
              type="text"
              className='w-full rounded-lg px-5 py-1 bg-white'
            />

            <button
              onClick={handlAdd}
              disabled={todo.length <= 3}
              className='bg-violet-800 hover:bg-violet-950 disabled:bg-violet-700 p-2 py-1 text-sm font-bold text-white rounded-md'>
              Save
            </button>
          </div>
        </div>

        {/* Toggle */}
        <div className='my-4'>
          <input
            type="checkbox"
            onChange={toggleFinished}
            checked={showFinished}
          /> Show Finished
        </div>

        <h2 className='text-xl font-bold'>Your Todos</h2>

        {/* Todos List */}
        <div className="todos">
          {todos.length === 0 && <div className='m-5'>No Todos to display</div>}

          {todos.map(item => {
            return (showFinished || !item.isCompleted) && (
              <div key={item.id} className="todo flex my-3 justify-between">

                <div className='flex gap-5'>
                  <input
                    name={item.id}
                    onChange={handleCheckbox}
                    type="checkbox"
                    checked={item.isCompleted}
                  />

                  <div className={item.isCompleted ? "line-through" : ""}>
                    {item.todo}
                  </div>
                </div>

                <div className="buttons flex">
                  <button
                    onClick={(e) => handleEdit(e, item.id)}
                    className='bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1'>
                    EDIT
                  </button>

                  <button
                    onClick={(e) => handleDelete(e, item.id)}
                    className='bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1'>
                    DELETE
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </>
  );
}

export default App;