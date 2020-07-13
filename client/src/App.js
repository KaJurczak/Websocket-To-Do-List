import React from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

class App extends React.Component {
  state = {
    tasks: [],
    taskName: '',
  }
  componentDidMount() {
    this.socket = io('http://localhost:8000/');
    this.socket.on('addTask', (task) => this.addTask(task));
    this.socket.on('removeTask', (id) => this.removeTask(id));
    this.socket.on('updateData', (tasks) => this.updateData(tasks));
  };

  removeTask(id, local) {
    const index = this.state.tasks.findIndex(item => item.id === id);
    this.state.tasks.splice(index, 1);
    if(local){
      this.socket.emit('removeTask', id);
      console.log('send to server info about removing task');
    }
  };

  addTask(task) {
    this.state.tasks.push(task);
  };

  submitForm = (e) => {
    e.preventDefault();
    const uniqueId = uuidv4();
    this.addTask({id: uniqueId, name: this.state.taskName});
    this.socket.emit('addTask', {id: uniqueId, name: this.state.taskName});
  };

  updateData(tasks) {
    this.setState({tasks: tasks});
  };

  render() {
    return (
      <div className="App">
    
        <header>
          <h1>ToDoList.app</h1>
        </header>
    
        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>
    
          <ul className="tasks-section__list" id="tasks-list">
            {this.state.tasks.map(item => {
              return(
              <li className="task" key={item.id}> {item.name} <button className="btn btn--red" onClick={() => this.removeTask(item.id, 'local')}>Remove</button></li>)}
            )}
          </ul>
     
          <form id="add-task-form" onSubmit={this.submitForm} >
            <input className="text-input" autoComplete="off" type="text" placeholder="Type your description" id="task-name" 
            value={this.state.taskName} 
            onChange={event => {
              this.setState({taskName: event.target.value}); 
            }}
            />
            <button className="btn" type="submit">Add</button>
          </form>
    
        </section>
      </div>
    );
  };

};

export default App;