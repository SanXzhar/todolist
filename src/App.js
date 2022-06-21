import {useEffect, useState} from "react";
import "./App.css";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [itemToAdd, setItemToAdd] = useState("");
  const [items, setItems] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    axios({
      method: 'get',
      url: ' https://api.todoist.com/rest/v1/tasks',
      headers: {
        Authorization: 'Bearer 43ae224e523fa69d5aad6956e5d1df1d62695c2b'}
    }).then((response) => setItems(response.data))     
  }, [])
  
  const handleChangeItem = (event) => {
    setItemToAdd(event.target.value);
  };

  const handleAddItem = () => {
    axios({
      method: 'post',
      url: "https://api.todoist.com/rest/v1/tasks",
      data: {
        'content': `${itemToAdd}`,
        'project_id': 2293572858
      },
      headers: {
        'Content-Type': 'application/json',
        'X-Request-Id': uuidv4(),
        'Authorization': 'Bearer 43ae224e523fa69d5aad6956e5d1df1d62695c2b'
      } 
    }).then((response) => {
      setItems([...items, response.data]);
      setItemToAdd("")
    })
  };

  const handleItemClose = (id) => {
    axios({
      method: 'post',
      url: `https://api.todoist.com/rest/v1/tasks/${id}/close`,
      headers: {
        Authorization: 'Bearer 43ae224e523fa69d5aad6956e5d1df1d62695c2b' 
      }
    })
  .then(() => setItems([...items.filter(item => item.id !== id)]))
  }

  const handleItemDelete = (id) => {
    axios({
      method: 'DELETE',
      url: `https://api.todoist.com/rest/v1/tasks/${id}`,
      headers: {
        Authorization: 'Bearer 43ae224e523fa69d5aad6956e5d1df1d62695c2b'
      }
    })
    .then(() => setItems([...items.filter(item => item.id !== id)]))
  };

  return (
    <div className="todo-app">
      {/* App-header */}
      <div className="app-header d-flex">
        <h1>Todo List</h1>
      </div>

      <div className="top-panel d-flex">
        {/* Search-panel */}
        <input
          type="text"
          className="form-control search-input"
          placeholder="type to search"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
        />
      </div>
      
           {/* List-group */}
      <ul className="list-group todo-list">
        {items.length > 0 ? (
          items.map((item) => (
            <li key={item.id} className="list-group-item">
              <span className={`todo-list-item${item.done ? " done" : ""}`}>
                <span className="todo-list-item-label">
                  {item.content}
                </span>
                <button
                  type="button"
                  className="btn btn-outline-success btn-sm float-right"
                  onClick={() => handleItemClose(item.id)}
                >
                  <i className="fa fa-exclamation" />
                </button>

                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm float-right"
                  onClick={() => handleItemDelete(item.id)}
                >
                  <i className="fa fa-trash-o" />
                </button>
              </span>
            </li>
          ))
        ) : (
          <div>No todos🤤</div>
        )}
      </ul>

      {/* Add form */}
      <div className="item-add-form d-flex">
        <input
          required
          value={itemToAdd}
          type="text"
          className="form-control"
          placeholder="What needs to be done"
          onChange={handleChangeItem}
        />
        <button className="btn btn-outline-secondary" onClick={handleAddItem}>
          Add item
        </button>
      </div>
    </div>
  );
}

export default App;