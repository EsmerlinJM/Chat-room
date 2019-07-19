import React, { Component } from "react";
import SidePanel from "./Sidepanel";
import WebSocketInstance from "../utils/websocket";

export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.waitForSocketConnection(() => {
      WebSocketInstance.addCallbacks(
        this.setMessages.bind(this),
        this.addMessage.bind(this)
      );
      WebSocketInstance.fetchMessages(this.props.currentUser);
    });
  }

  waitForSocketConnection(callback) {
    const component = this;
    setTimeout(() => {
      if (WebSocketInstance.state() === 1) {
        console.log("Connection is secure");
        callback();
        return;
      } else {
        console.log("Waiting for connection...");
        component.waitForSocketConnection(callback);
      }
    }, 100);
  }

  addMessage(message) {
    this.setState({ messages: [...this.state.messages, message] });
  }

  setMessages(messages) {
    this.setState({ messages: messages.reverse() });
  }

  sendMessageHandler = event => {
    event.preventDefault();
    const messageObject = { from: "admin", content: this.state.message };
    WebSocketInstance.newChatMessage(messageObject);
    this.setState({ message: "" });
  };

  messageChangeHandler = event => {
    this.setState({
      message: event.target.value
    });
  };

  renderMessages = messages => {
    const currentUser = "admin";
    return messages.map((message, i) => (
        <li 
            key={message.id} 
            className={message.author === currentUser ? 'sent' : 'replies'}>
            <img src="http://emilcarlsson.se/assets/mikeross.png" alt="Avatar" />
            <p>{message.content}
                <br />
                <small className={message.author === currentUser ? 'sent' : 'replies'}>
                {Math.round((new Date().getTime() - new Date(message.timestamp).getTime())/60000)} minutes ago
                </small>
            </p>
        </li>
    ));
  };

  render() {
    const messages = this.state.messages;
    return (
      <div>
        <div id="frame">
          <SidePanel />
          <div className="content">
            <div className="contact-profile">
              <img
                src="http://emilcarlsson.se/assets/harveyspecter.png"
                alt=""
              />
              <p>username</p>
              <div className="social-media">
                <i className="fa fa-facebook" aria-hidden="true" />
                <i className="fa fa-twitter" aria-hidden="true" />
                <i className="fa fa-instagram" aria-hidden="true" />
              </div>
            </div>
            <div className="messages">
              <ul id="chat-log">{messages && this.renderMessages(messages)}</ul>
            </div>
            <div className="message-input">
              <form onSubmit={this.sendMessageHandler}>
                <div className="wrap">
                  <input
                    onChange={this.messageChangeHandler}
                    value={this.state.message}
                    id="chat-message-input"
                    type="text"
                    placeholder="Write your message..."
                  />
                  <i
                    className="fa fa-paperclip attachment"
                    aria-hidden="true"
                  />
                  <button id="chat-message-submit" className="submit">
                    <i className="fa fa-paper-plane" aria-hidden="true" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
