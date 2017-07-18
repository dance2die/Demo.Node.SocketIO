import _ from 'lodash';
import React, {Component} from 'react';
import sentiment from 'sentiment';

export default class ShowMessages extends Component {
    getMessageJSX = ({messages}) => {
        console.log('ShowMessages.messages', messages);
        if (_.isEmpty(messages)) return <div>Loading...</div>;

        let messageJSX = _.map(messages, message => {
            let text = message.text;
            if (message.previousMessage) text = message.message.text;

            let sentimentResult = sentiment(text);
            console.log(text);
            console.group();
            console.log(sentimentResult);
            console.groupEnd();

            return <li key={message.ts}>{text}</li>;
        });

        return messageJSX;
    }

    render() {
        return <div>{this.getMessageJSX(this.props)}</div>;
    }
}