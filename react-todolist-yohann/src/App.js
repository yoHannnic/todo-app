import React, { useState, useEffect } from 'react';
import './App.css'; // Ensure proper styling

function TodoApp() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { text: newTodo, isComplete: false, isEditing: false }]);
      setNewTodo("");
    }
  };

  const handleComplete = (index) => {
    const updatedTodos = todos.map((todo, i) =>
      i === index ? { ...todo, isComplete: !todo.isComplete } : todo
    );
    setTodos(updatedTodos);
  };

  const handleEdit = (index) => {
    const updatedTodos = todos.map((todo, i) =>
      i === index ? { ...todo, isEditing: !todo.isEditing } : todo
    );
    setTodos(updatedTodos);
  };

  const handleSave = (index, newText) => {
    const updatedTodos = todos.map((todo, i) =>
      i === index ? { ...todo, text: newText, isEditing: false } : todo
    );
    setTodos(updatedTodos);
  };

  const handleRemove = (index) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.isComplete));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") addTodo();
  };

  return (
    <div className="todo-app">
      <h1>To-Do List</h1>
      <div className="input-container">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter a new task"
        />
        <button onClick={addTodo}>Add ToDo</button>
      </div>

      {todos.length === 0 ? (
        <p>No todos available. Add a todo to get started!</p>
      ) : (
        <>
          <ul>
            {todos.map((todo, index) => (
              <TodoItem
                key={index}
                todo={todo}
                index={index}
                onComplete={handleComplete}
                onEdit={handleEdit}
                onSave={handleSave}
                onRemove={handleRemove}
              />
            ))}
          </ul>
          <button onClick={clearCompleted} className="clear-btn">
            Clear Completed Tasks
          </button>
        </>
      )}
    </div>
  );
}

function TodoItem({ todo, index, onComplete, onEdit, onSave, onRemove }) {
  const [editText, setEditText] = useState(todo.text);

  return (
    <li className={`todo-item ${todo.isComplete ? 'completed' : ''}`}>
      {todo.isEditing ? (
        <>
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />
          <button onClick={() => onSave(index, editText)}>Save</button>
        </>
      ) : (
        <>
          <span>{todo.text}</span>
          <button
            onClick={() => onComplete(index)}
            style={{ backgroundColor: todo.isComplete ? 'green' : 'gray' }}
          >
            {todo.isComplete ? 'Undo' : 'Complete'}
          </button>
          <button
            onClick={() => onEdit(index)}
            disabled={todo.isComplete || todo.isEditing}
            style={{ opacity: todo.isComplete || todo.isEditing ? 0.5 : 1 }}
          >
            Edit
          </button>
          <button
            onClick={() => onRemove(index)}
            disabled={todo.isEditing}
            style={{ opacity: todo.isEditing ? 0.5 : 1 }}
          >
            Remove
          </button>
        </>
      )}
    </li>
  );
}

export default TodoApp;
