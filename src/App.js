import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import io from 'socket.io-client'
import _ from 'lodash';

let socket = io('http://localhost:3001');

class App extends Component {
    state = {messages: []};

    componentDidMount() {
        socket.on('chat message', (message) => {
            console.log(message.text);
            console.log('this.state.messages', this.state.messages);
            this.setState({messages: [...this.state.messages, message]});
        });
    }

    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h2>Welcome to React</h2>
                </div>
                <div className="App-intro">
                    <ul>
                        <ShowMessages messages={this.state.messages}/>
                    </ul>
                </div>
            </div>
        );
    }
}

const ShowMessages = ({messages}) => {
    console.log('ShowMessages.messages', messages);
    if (_.isEmpty(messages)) return <div>loading...</div>;

    let messageJSX = _.map(messages, message => {
        if (message.subtype === "message_changed"){
            return <li key={message.ts}>{message.message.text}</li>;
        } else {
            return <li key={message.ts}>{message.text}</li>;
        }
    });

    return <div>{messageJSX}</div>;
}

export default App;
