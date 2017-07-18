import _ from 'lodash';
import React, {Component} from 'react';

export default class ShowMessages extends Component {
    getMessageJSX = ({messages}) => {
        console.log('ShowMessages.messages', messages);
        if (_.isEmpty(messages)) return <div>loading...</div>;

        let messageJSX = _.map(messages, message => {
            if (message.subtype === "message_changed") {
                return <li key={message.ts}>{message.message.text}</li>;
            } else {
                return <li key={message.ts}>{message.text}</li>;
            }
        });

        return messageJSX;
    }

    render() {
        return <div>{this.getMessageJSX(this.props)}</div>;
    }
}