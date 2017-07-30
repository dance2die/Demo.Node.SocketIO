import React, {Component} from 'react';
import sentiment from 'sentiment';
import {Chart} from 'react-google-charts';
import _ from 'lodash';
// import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';

export default class ShowMessages extends Component {
    maxMessages = 10;

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
                [new Date(), 0, 'This is the beginning of the end'],
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
                {
                    type: 'string',
                    role: 'tooltip',
                    'p': {'html': true}
                },
            ],
            options: {
                title: 'Sentiment vs Time',
                randomProperty: "xxxxx",
                tooltip: {isHtml: true},
                hAxis: {
                    legend: 'none',
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
                vAxis: {
                    title: 'Sentiment',
                    minValue: -10,
                    maxValue: 10,
                    gridlines: {
                        count: 1,
                    },
                    minorGridlines: {
                        count: -1,
                    }
                },
            },
        };
    }

    setChartMaxDate = (date) => {
        this.setState({
            options: {
                ...this.state.options,
                hAxis: {
                    viewWindow: {
                        max: date
                    }
                }
            }
        });
    }

    getMessageText = (message) => {
        let text = message.text;
        if (message.previousMessage) text = message.message.text;

        return text;
    }

    buildTooltip = (messageContext) => {
        let user = _.find(messageContext.users, {'id': messageContext.message.user});
        console.log('buildTooltip.user', user);
        console.log("this.state", this.state);

        // Get Channel name
        let {name_normalized: channelName} = _.find(messageContext.channels, {'id': messageContext.message.channel});

        // Get name (ID), real name & imageURL
        let {name, real_name, profile: {image_32: imageURL}} = user;
        console.log('buildTooltip: channelName, name, real_name, imageURL', channelName, name, real_name, imageURL);

        // Refer to https://developers.google.com/chart/interactive/docs/customizing_tooltip_content
        let text = this.getMessageText(messageContext.message);

        let content = ReactDOMServer.renderToStaticMarkup(
            <div>
                <img alt="icon" src={imageURL} />
                <div>Channel: {channelName}</div>
                <div>ID: {name}</div>
                <div>Name: {real_name}</div>
                <div>Text: {text}</div>
            </div>
        );

        console.log('content', content);
        return content;
    }

    componentDidUpdate(prevProps, prevState) {
        // console.log('ShowMessages:componentDidUpdate');

        console.log('prevProps & this.props', prevProps, this.props);

        // if (prevProps.messageContext.message.ts !== this.props.messageContext.message.ts) {
        if (this.props.messageContext.message && prevProps.messageContext.message !== this.props.messageContext.message) {
            const {message} = this.props.messageContext;
            console.log('message', message);

            let text = this.getMessageText(message);
            const {score} = sentiment(text);
            let date = new Date();
            let tooltip = this.buildTooltip(this.props.messageContext);

            let newRow = [date, score, tooltip];
            console.log('newRow', newRow);
            this.setChartMaxDate(date);

            // this.setState({rows: [...this.state.rows, newRow]});
            // let rows = this.state.rows;
            if (this.state.rows.length > this.maxMessages) {
                console.log("***dequeing an element from rows");
                this.state.rows.shift();
            }
            this.setState({rows: [...this.state.rows, newRow]});
            // console.log(this.state.rows);
        }
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