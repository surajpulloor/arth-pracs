import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';


import CountDownTimer from './CountDownTimer';

import '../styles/Problem.css';

class Problem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timeTaken: 1,
            res: 0,
            result: '',
            reset: false
        };
    }

    setTimer = () => {
        if (!this.props.showResult) {

            this.interval = setInterval(() => this.setState((state, props) => {
                return { timeTaken: state.timeTaken + 1 }
            }), 1000);

        }

        this.computeResult();

    }

    computeResult = () => {
        let res;

        switch (this.props.op) {
            case '+':
                res = this.props.num1 + this.props.num2;
                break;
            case '-':
                res = this.props.num1 - this.props.num2;
                break;
            case '*':
                res = this.props.num1 * this.props.num2;
                break;
            case '/':
                res = this.props.num1 / this.props.num2;
                break;
        }

        this.setState({ res });
    }

    componentDidMount() {
        this.setTimer();
    }

    componentWillReceiveProps(nextProps, nextState) {
        if (
            this.props.num1 === nextProps.num1 &&
            this.props.num2 === nextProps.num2 &&
            this.props.stopTimer === nextProps.stopTimer
        )
            return false;

        if (this.interval && !this.props.stopTimer) {
            clearInterval(this.interval);
            this.setState({ timeTaken: 1 }, this.setTimer);
        }

        if (this.props.stopTimer) {
            clearInterval(this.interval);
        }

        return true;
    }

    componentWillUnmount() {
        if (this.interval)
            clearInterval(this.interval);
    }

    onEnter = (e) => {
        if (e.keyCode === 13) {

            if (this.state.result === '') {
                alert("Please enter a number!");
                return;
            }

            this.gotoNextProblem();
            this.setState({ result: '', reset: true});
        }
    }

    gotoNextProblem = () => {
        
        this.setState({ reset: false});

        let timeTaken = `${this.state.timeTaken}s`;

        if (this.state.timeTaken >= 60) {
            let time = this.state.timeTaken / 60;

            let minutes = Math.floor(time);
            let seconds = Math.floor((time - minutes) * 100);

            timeTaken = `${minutes}m ${seconds}s`;

        }

        this.props.addProblem({
            num1: this.props.num1,
            num2: this.props.num2,
            op: this.props.op,
            res: parseInt(this.state.result),
            timeTaken,
        });

        this.props.updateResult(this.state.res === parseInt(this.state.result));
        this.props.onTimeBoundOver();
    }


    resetTimerState = () => {
        this.setState({ reset: false });
    }

    bindResult = (e) => {
        this.setState({
            result: e.target.value
        });
    }

    render() {
        return (
            <div className={this.props.showResult ? "problem" : "row problem"}>
                <div className={this.props.showResult ? "problem-container" : "col-md-5 problem-container"}>

                    <div className="problem-id">
                        <h3>{this.props.id}.</h3>
                    </div>

                    <div className="num1">
                        <h4>
                            {this.props.num1}
                        </h4>
                    </div>


                    <div className="num2-and-result">
                        <h4 className="num2">
                            <span>{this.props.op}</span>
                            <span style={{
                                paddingLeft:
                                    (this.props.num1.toString().length - this.props.num2.toString().length) / 2 * 1.5 - 0.2 + 'rem'
                            }}>
                                {this.props.num2}
                            </span>

                        </h4>
                        <hr />

                        {
                            this.props.showResult
                                ? <h4>
                                    <span className="result">{this.props.res}</span>
                                    {
                                        this.props.res === this.state.res
                                            ? <FontAwesomeIcon icon={faCheck} style={{ color: 'green', marginLeft: '4px' }} />
                                            : <FontAwesomeIcon icon={faTimes} style={{ color: 'red', marginLeft: '4px' }} />
                                    }

                                    {
                                        this.props.res !== this.state.res
                                            ?
                                            <div style={{ display: 'inline-block', marginLeft: '8px' }}>
                                                <span>{this.state.res}</span>
                                                <FontAwesomeIcon icon={faCheck} style={{ color: 'green', marginLeft: '4px' }} />
                                            </div>
                                            :
                                            ''

                                    }
                                    <span className="float-right">{this.props.timeTaken}</span>
                                </h4>
                                : <div>
                                    <input 
                                        type="number" 
                                        placeholder="Please enter your Ans." 
                                        className="form-control" 
                                        onKeyDown={this.onEnter} 
                                        onChange={this.bindResult} 
                                        value={this.state.result}
                                        autoFocus 
                                    />

                                    {
                                            this.props.isTimeBound

                                            ?

                                            <CountDownTimer 
                                                startTime={this.props.timeBoundValue} 
                                                onTimeOver={this.gotoNextProblem}
                                                repeat={true}
                                                reset={this.state.reset}
                                                resetTimerState={this.resetTimerState}
                                            />

                                            :

                                            <span></span>
                                    }

                                </div>
                        }

                        <hr />
                    </div>


                </div>


            </div>
        );
    }
}

export default Problem;