import React, { Component } from 'react';
import '../styles/CountDownTimer.css';

class CountDownTimer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            min: 0,
            sec: 0,
            timeInSeconds: 0
        };

        this.interval = null;
    }

    componentDidMount() {
        this.setState((state, props) => {
            const time = this.convertIntoTime(props.startTime);
            return {
                min: time.min,
                sec: time.sec,
                timeInSeconds: props.startTime
            }
        }, () => {
            this.updateTime();
            this.interval = setInterval(this.updateTime, 1000);
        });
    }


    componentWillUnmount() {
        clearInterval(this.interval);
    }


    UNSAFE_componentWillReceiveProps(nextProps, nextState) {
        if (!nextProps.reset) {
            return false;
        }

        clearInterval(this.interval);

        this.setState((state, props) => {
            const time = this.convertIntoTime(props.startTime);
            return {
                min: time.min,
                sec: time.sec,
                timeInSeconds: props.startTime
            }
        }, () => {
            this.updateTime();
            this.interval = setInterval(this.updateTime, 1000);
        });

    }

    

    convertIntoTime = (timeInSeconds) => {

        let minutes = 0;
        let seconds = 0;
    
        if (timeInSeconds > 60) {
    
            minutes = parseInt(timeInSeconds / 60);
            seconds = timeInSeconds - minutes * 60;
    
        } else {
            seconds = timeInSeconds;
        }
    
        
    
        return {
            min: minutes,
            sec: seconds
        };
    }


    convertElapsedTime = () => {

        const time = this.convertIntoTime(this.props.startTime - this.state.timeInSeconds);

        let timeFormat = "";

        if (time.min !== 0) {
            timeFormat = `${time.min}m `;
        }

        if (time.sec !== 0) {
            timeFormat += `${time.sec}s`;
        }

        return timeFormat;
    }


    resetTimeToStart = () => {
        if (this.props.repeat && this.state.sec === 0) {
            const time = this.convertIntoTime(this.props.startTime);

            this.setState((state, props) => ({

                    min: time.min,
                    sec: time.sec,
                    timeInSeconds: props.startTime

            }), this.props.onTimeOver);
        }
        
    }


    updateTime = () => {
        if (this.props.reset) {
            this.resetTimeToStart();
            this.props.resetTimerState()
        }

        let min = this.state.min;
        let sec = this.state.sec;

        if (sec === 0) {
            min -= 1;
            sec = 59;
        } else {
            sec -= 1;
        }


        this.setState((state, props) => {
            return {
                min: min,
                sec: sec,
                timeInSeconds: state.timeInSeconds - 1
            }
        }, () => {
            if (this.props.currentTime) {
                this.props.currentTime(this.state.timeInSeconds, this.convertElapsedTime());
            }
            this.resetTimeToStart();
        });

    }


    render() {
        return (
            <h3>
                <span>You have left: </span>
                <span className={this.state.min < 5 ? (this.state.min === 0 ? "countdown-red" : "countdown-orange") : ""}>
                    {this.state.min !== 0 ? ((this.state.min < 10 ? '0' : '') + this.state.min + ":") : ""}
                    {(this.state.sec < 10 && this.state.min !== 0 ? '0' : '') + this.state.sec + (this.state.min === 0 ? "s" : "")}
                </span>
                
            </h3>
        );
    }
}

export default CountDownTimer;