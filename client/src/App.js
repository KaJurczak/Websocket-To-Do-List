import React from 'react';
import io from 'socket.io-client';

class App extends React.Component {
  state = {
    tasks: [],
    taskName: '',
  }
  componentDidMount() {
    this.socket = io();
    this.socket.connect("http://localhost:8000/");
    this.socket.on('addTask', (task) => this.addTask(task));
    this.socket.on('removeTask', (id) => this.removeTask(id));
    this.socket.on('updateData', (tasks) => this.updateTasks(tasks));
  };

  removeTask(id, local) {
    this.state.tasks.splice(id, 1);
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
    this.addTask(this.state.taskName);
    this.socket.emit('addTask', this.state.taskName);
  };

  updateData(tasks) {
    this.state.tasks.push(tasks);
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
              <li className="task" key={item}> {item} <button className="btn btn--red" onClick={() => this.removeTask(this.state.tasks.indexOf(item), 'local')}>Remove</button></li>)}
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