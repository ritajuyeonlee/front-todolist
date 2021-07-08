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


    useEffect(() => {
        async function fetchTodos() {
            setLoading(true)
            const response = await axios.get('/todo')
            setTodos(response.data);
            setLoading(false);
        }
        fetchTodos()
    }, []);

    const onChange = e => {
        setInput(e.target.value);
    };

    const onCreate = () => {
        if (task !== "") {
            const todo = {
                task: task,
                check: true,
            };
            axios.post('/todo',todo)
            setTodos(todos.concat(todo));
            setInput("");
        }
    };
    const onFilter = filter => {
        setFilter(filter);
    };
    const onToggle = todo => {
        axios.put('/todo',{...todo,check:!todo.check})
        setTodos(
            todos.map(t =>
                t.id === todo.id ? { ...t, check: !t.check } : t
            )
        );
    };

    const onRemove = id => {
        axios({
            url: '/todo',
            method: 'delete',
            params: {
                id: id
            }
        })
        setTodos(todos.filter(todo => todo.id !== id));

    };

    if(loading) return <div> Loading...</div>
    if(error) return <div> Error </div>
    if(!todos) return null;

  return (
      <div>
        <div className="inputbox">
            <input
                className="input"
                name="task"
                placeholder="what to do?"
                value={task}
                onChange={onChange}
            />
            <button className="button" onClick={onCreate}>
                add
            </button>
        </div>
          <div className="listbox">
              <h1>TO DO LIST</h1>
              <TodoList
                  todos={filter == null ? todos : todos.filter(todo => todo.check === filter)}
                  onToggle={onToggle}
                  onRemove={onRemove}

              />

          </div>
          <div className="buttonbox">
              <button className="button" onClick={() => onFilter(null)}>
                  all
              </button>
              <button className="button" onClick={() => onFilter(true)}>
                  active
              </button>
              <button className="button" onClick={() => onFilter(false)}>
                  completed
              </button>
          </div>
      </div>
  );
}

export default App;
