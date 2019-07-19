import React, { Component } from 'react';
import Chat from './components/Chat'
import WebSocketInstance from '../src/utils/websocket'

class App extends Component {
  componentDidMount() {
    WebSocketInstance.connect();
  }
  render() {
    return (
      <div>
        <Chat/>
      </div>
    );
  } 
}

export default App;
