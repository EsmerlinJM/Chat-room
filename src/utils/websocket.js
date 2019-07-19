class WebSocketService {

    static instance = null;
    callbacks = {};

    static getInstance() {
        if(!WebSocketService.instance) {
            WebSocketService.instance = new WebSocketService();
        }
        return WebSocketService.instance;
    }

    constructor() {
        this.socketRf = null;
    }

    connect() {
        const path = 'ws://127.0.0.1:8000/ws/chat/test/';
        this.socketRf = new WebSocket(path);
        this.socketRf.onopen = () => {
            console.log('Websocket open');
        }
        this.socketNewMessage(JSON.stringify({
            command: 'fetch_messages'
        }));
        this.socketRf.onmessage = e => {
            this.socketNewMessage(e.data);
        }
        this.socketRf.onerror = e => {
            console.error(e.message);
        }
        this.socketRf.onclose = e => {
            console.log('Websocket closed');
            this.connect();
        }
    }

    socketNewMessage(data){
        const parseData = JSON.parse(data);
        const command = parseData.command;
        
        if(Object.keys(this.callbacks).length === 0) return;
        
        if (command === 'messages') {
            this.callbacks[command](parseData.messages);
        }
        if (command === 'new_message') {
            this.callbacks[command](parseData.message);
        }
    }

    fetchMessages(username) {
        this.sendMessage({ command: 'fetch_messages', username: username });
    }

    newChatMessage(message) {
        this.sendMessage({ command: 'new_message', from: message.from, message: message.content });
    }

    addCallbacks(messageCallback,  newMessageCallback) {
        this.callbacks['messages'] = messageCallback;
        this.callbacks['new_message'] = newMessageCallback;
    }

    sendMessage(data){
        try {
            this.socketRf.send(JSON.stringify({...data }));
        } catch (error) {
            console.error(error.message);
        }
    }

    state() {
        return this.socketRf.readyState;
    }

}

const WebSocketInstance = WebSocketService.getInstance();

export default WebSocketInstance; 