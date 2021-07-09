import React, { useState, useEffect } from "react";
import './App.css';
import axios from "axios";
import TodoList from "./Todolist";

function App() {
    const [todos, setTodos] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [input, setInput] = useState("");
    const task = input;
    const [filter, setFilter] = useState(null);


    async function fetchTodos() {
        try{
                setLoading(true)
                const response = await axios.get('/todo')
                setTodos(response.data);
        }catch (e) {
                setError(e)
            }
            setLoading(false);
    }

    useEffect(() => {
        fetchTodos()
    }, []);

    const onChange = e => {
        setInput(e.target.value);
    };

    async function onCreate() {
        if (task !== "") {
            const todo = {
                task: task,
                check: true,
            };
            const newtodo = await axios.post('/todo',todo)
            // setTodos(todos.concat(todo))
            await fetchTodos()

            console.log(newtodo)
            setInput("");
        }
    };
    const onFilter = filter => {
        setFilter(filter);
    };
    const onToggle = todo => {
        const newTodo={
            ...todo,
            check: !todo.check
        }
        axios.put('/todo', newTodo)
        setTodos(
            todos.map(t =>
                t.id === todo.id ? { ...t, check: !t.check } : t
            )
        );
        console.log(todos)
    };

    const onRemove = id => {
        axios({
            url: '/todo',
            method: 'delete',
            params: {id: id}
        })
        setTodos(todos.filter(todo => todo.id !== id));
    };

    if(loading) return <div> Loading...</div>
    if(error) return <div> Error </div>
    if(!todos) return null;

  return (
      <div>
        <div className="inputbox">
              <h1>TO DO LIST</h1>
            <input
                className="input"
                name="task"
                placeholder="what to do?"
                value={task}
                onChange={onChange}
            />&nbsp;&nbsp;
            <button className="button" onClick={onCreate}>
                add
            </button>
        </div>
          <div className="listbox">
              <div className="buttonbox">
                  <button className="button" onClick={() => onFilter(null)}>
                      all
                  </button>&nbsp;&nbsp;
                  <button className="button" onClick={() => onFilter(true)}>
                      active
                  </button>&nbsp;&nbsp;
                  <button className="button" onClick={() => onFilter(false)}>
                      completed
                  </button>
              </div>
              <TodoList
                  todos={filter == null ? todos : todos.filter(todo => todo.check === filter)}
                  onToggle={onToggle}
                  onRemove={onRemove}

              />

          </div>

      </div>
  );
}

export default App;
