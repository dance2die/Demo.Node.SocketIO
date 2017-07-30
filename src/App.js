import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import io from 'socket.io-client'
import ShowMessages from './components/show_messages';
import _ from 'lodash';

let socket = io('http://localhost:3001');
// let socket = io('https://forrobnode.localtunnel.me');

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
           this.setPayloadState(payload);
        });
    }

    setPayloadState = (payload) => {
        const {channels, users} = _.pick(payload, ['channels', 'users']);
        console.log('channels & users', channels, users);

        let usersState = this.extractUsersState(users);
        let channelsState = this.extractChannelsState(channels);
        console.log('channelsState & usersState', channelsState, usersState);

        // https://stackoverflow.com/a/45067184/4035
        var mappedUsersState = _.map(users, _.partialRight(_.pick, ['name', 'real_name', 'team_id', 'profile.image_32']));
        console.log('mappedUsersState', mappedUsersState);

        var mappedChannelsState = _.map(users, _.partialRight(_.pick, ['real_name', 'team_id', 'profile.image_32']));

        this.setState({channels: channelsState, users: usersState});
    }

    extractUsersState = (users) => {
        return _.keyBy(users, 'id');
    }

    extractChannelsState = (channels) => {
        return _.keyBy(channels, 'id');
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
