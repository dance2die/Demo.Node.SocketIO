import _ from 'lodash';
import React, {Component} from 'react';
import sentiment from 'sentiment';
import {Chart} from 'react-google-charts';

export default class ShowMessages extends Component {
    constructor(props) {
        super(props);

        this.chartEvents = [
            {
                eventName: 'select',
                callback(Chart) {
                    // Returns Chart so you can access props and  the ChartWrapper object from chart.wrapper
                    console.log('Selected ', Chart.chart.getSelection());
                },
            },
        ];

        this.state = {
            messages: [],
            rows: [
                [new Date(1789, 4, 30), 0]
            ],
            columns: [
                {
                    type: 'date',
                    label: 'Time',
                },
                {
                    type: 'number',
                    label: 'Sentiment',
                },
            ],
            options: {
                title: 'Sentiment vs Time',
                hAxis: {title: 'Time'},
                vAxis: {title: 'Sentiment', minValue: -100, maxValue: 100},
                legend: 'none',
            },
        };

        // https://medium.com/@justintulk/best-practices-for-resetting-an-es6-react-components-state-81c0c86df98d
        this.baseState = _.pickBy(this.state, (propName) => propName !== "messages");
    }

    componentDidUpdate(prevProps, prevState) {
        console.log('ShowMessages:componentDidUpdate');

        console.log(prevProps);
        console.log(this.props);

        const {message} = this.props;
        this.setState({messages: [...this.state.messages, message]});

        this.setState(this.baseState);
        console.log('after base state: this.state.messages.length', this.state.messages.length);

        _.map(this.state.messages, message => {
            let text = message.text;
            if (message.previousMessage) text = message.message.text;

            let sentimentResult = sentiment(text);
            console.log(text);
            console.group();
            console.log(sentimentResult);
            console.groupEnd();

            const {score} = sentiment(text);
            let date = new Date();
            let newRow = [date, score];

            console.log(newRow);

            this.setState({rows: [...this.state.rows, newRow]});
        });
        //
        // // only update chart if the data has changed
        // if (prevProps.data !== this.props.data) {
        //     // this.chart = c3.load({
        //     //     data: this.props.data
        //     // });
        //
        //
        // }
    }

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
        // return <div>{this.getMessageJSX(this.props)}</div>;
        return (
            <Chart
                chartType="LineChart"
                rows={this.state.rows}
                columns={this.state.columns}
                options={this.state.options}
                graph_id="ScatterChart"
                width="100%"
                height="400px"
                chartEvents={this.chartEvents}
            />
        );
    }
}