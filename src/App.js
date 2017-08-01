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
const IO_EVENT_MEMBER_JOINED_CHANNEL = 'member_joined_channel';
const IO_EVENT_MEMBER_LEFT_CHANNEL = 'member_left_channel';


class App extends Component {
    state = {
        messageContext: {
            message: {},
            channels: [],
            users: [],
        }
    };

    componentDidMount() {
        // Catches Slack API payload (users, and channels data)
        socket.on(IO_EVENT_INITIAL_PAYLOAD, (payload) => {
            console.log(`${IO_EVENT_INITIAL_PAYLOAD}`, payload);
            this.setPayloadState(payload);
        });

        // Catches Slack message typed by a user
        socket.on(IO_EVENT_CHAT_MESSAGE, (message) => {
            this.setState({messageContext: {...this.state.messageContext, message}});
        });

        socket.on(IO_EVENT_MEMBER_JOINED_CHANNEL, (context) =>{
            console.log('IO_EVENT_MEMBER_JOINED_CHANNEL', context);
            // this.setState({
            //    messageContext: {
            //        ...this.state.messageContext,
            //        users: [
            //            ...this.state.messageContext.users,
            //
            //        ]
            //    }
            // });
        });

        socket.on(IO_EVENT_MEMBER_LEFT_CHANNEL, (context) => {
            console.log('-----IO_EVENT_MEMBER_LEFT_CHANNEL', context);
        });
    }

    setPayloadState = (payload) => {
        const {channels, users} = _.pick(payload, ['channels', 'users']);
        console.log('channels & users', channels, users);

        // let usersState = this.extractUsersState(users);
        // let channelsState = this.extractChannelsState(channels);
        // console.log('channelsState & usersState', channelsState, usersState);

        // https://stackoverflow.com/a/45067184/4035
        var mappedUsersState = _.map(users, _.partialRight(_.pick, ['id', 'name', 'real_name', 'team_id', 'profile.image_32']));
        var mappedChannelsState = _.map(channels, _.partialRight(_.pick, ['id', 'name_normalized']));
        console.log('mappedChannelsState & mappedUsersState', mappedChannelsState, mappedUsersState);

        this.setState({
            messageContext: {
                channels: mappedChannelsState,
                users: mappedUsersState
            }
        });
    }

    // extractUsersState = (users) => {
    //     return _.keyBy(users, 'id');
    // }
    //
    // extractChannelsState = (channels) => {
    //     return _.keyBy(channels, 'id');
    // }

    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h2>Welcome to React</h2>
                </div>
                <div className="App-intro">
                    <ul>
                        <ShowMessages messageContext={this.state.messageContext} />
                    </ul>
                </div>
            </div>
        );
    }
}

export default App;
