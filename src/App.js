import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import io from 'socket.io-client'
import ShowMessages from './components/show_messages';

let socket = io('http://localhost:3001');

class App extends Component {
    state = {message: {}};

    componentDidMount() {
        socket.on('chat message', (message) => {
            console.log(message.text);
            console.log('this.state.messages', this.state.messages);
            // this.setState({messages: [...this.state.messages, message]});
            this.setState({message});
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
