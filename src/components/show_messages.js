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

        let today = new Date();
        let maxTime = new Date();
        maxTime.setMinutes(today.getMinutes() + 3);

        this.state = {
            rows: [
                [new Date(), 0],
            ],
            columns: [
                {
                    type: 'datetime',
                    label: 'Time',
                },
                {
                    type: 'number',
                    label: 'Sentiment',
                },
            ],
            options: {
                title: 'Sentiment vs Time',
                hAxis: {
                    title: 'Time',
                    viewWindow: {
                        min: today,
                        max: maxTime,
                    },
                    gridlines: {
                        count: -1,
                        units: {
                            days: {format: ['MMM dd']},
                            hours: {format: ['HH:mm', 'ha']},
                        }
                    },
                    minorGridlines: {
                        units: {
                            hours: {format: ['hh:mm:ss a', 'ha']},
                            minutes: {format: ['HH:mm a Z', ':mm']}
                        }
                    }
                },
                vAxis: {title: 'Sentiment', minValue: -10, maxValue: 10},
                legend: 'none',
            },
        };

        // this.rows = [
        //     [new Date(), 0],
        // ];

        // https://medium.com/@justintulk/best-practices-for-resetting-an-es6-react-components-state-81c0c86df98d
        this.baseState = _.pickBy(this.state, (propName) => propName !== "messages");
    }

    componentDidUpdate(prevProps, prevState) {
        console.log('ShowMessages:componentDidUpdate');

        console.log(prevProps);
        console.log(this.props);

        if (prevProps.message.ts !== this.props.message.ts) {
            const {message} = this.props;
            let text = message.text;
            if (message.previousMessage) text = message.message.text;

            // let sentimentResult = sentiment(text);
            // console.log(text);
            // console.group();
            // console.log(sentimentResult);
            // console.groupEnd();

            const {score} = sentiment(text);
            let date = new Date();
            let newRow = [date, score];

            console.log(newRow);

            // this.setState({rows: [...this.state.rows, newRow]});
            this.setState({rows: [...this.state.rows, newRow]});
            console.log(this.state.rows);
        }

        // // this.setState(this.baseState);
        // // console.log('after base state: this.state.messages.length', this.state.messages.length);
        //
        // _.map(this.state.messages, message => {
        //     let text = message.text;
        //     if (message.previousMessage) text = message.message.text;
        //
        //     let sentimentResult = sentiment(text);
        //     console.log(text);
        //     console.group();
        //     console.log(sentimentResult);
        //     console.groupEnd();
        //
        //     const {score} = sentiment(text);
        //     let date = new Date();
        //     let newRow = [date, score];
        //
        //     console.log(newRow);
        //
        //     this.setState({rows: [...this.state.rows, newRow]});
        // });
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