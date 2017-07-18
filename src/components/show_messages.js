import React, {Component} from 'react';
import sentiment from 'sentiment';
import {Chart} from 'react-google-charts';

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
                tooltip: {isHtml: true},
                legend: 'none',
            },
        };
    }

    setChartMaxDate = (date) => {
        this.setState({
            options: {
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

    buildTooltip = (message) => {
        // Refer to https://developers.google.com/chart/interactive/docs/customizing_tooltip_content
        let text = this.getMessageText(message);

        return text;
    }

    componentDidUpdate(prevProps, prevState) {
        console.log('ShowMessages:componentDidUpdate');

        console.log(prevProps);
        console.log(this.props);

        if (prevProps.message.ts !== this.props.message.ts) {
            const {message} = this.props;
            let text = this.getMessageText(message);
            const {score} = sentiment(text);
            let date = new Date();
            let tooltip = this.buildTooltip(message);

            let newRow = [date, score, tooltip];
            console.log(newRow);
            this.setChartMaxDate(date);

            // this.setState({rows: [...this.state.rows, newRow]});
            // let rows = this.state.rows;
            if (this.state.rows.length > this.maxMessages) {
                console.log("***dequeing an element from rows");
                this.state.rows.shift();
            }
            this.setState({rows: [...this.state.rows, newRow]});
            console.log(this.state.rows);
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