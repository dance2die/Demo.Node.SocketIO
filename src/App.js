import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import io from 'socket.io-client'
import ShowMessages from './components/show_messages';

let socket = io('http://localhost:3001');

const IO_EVENT_INITIAL_PAYLOAD = 'initial payload';
const IO_EVENT_CHAT_MESSAGE = 'chat message';


class App extends Component {
    state = {
        message: {},
        channels: [],
        users: [],
    };

    componentDidMount() {
        socket.on(IO_EVENT_CHAT_MESSAGE, (message) => {
            this.setState({message});
        });

        socket.on(IO_EVENT_INITIAL_PAYLOAD, (payload) => {
           console.log(`${IO_EVENT_INITIAL_PAYLOAD}`, payload);
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
                        <ShowMessages message={this.state.message} />
                    </ul>
                </div>
            </div>
        );
    }
}

export default App;
