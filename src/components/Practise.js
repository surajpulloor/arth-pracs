import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import VisibleProblem from '../containers/VisibleProblem';
import StopWatch from './Stopwatch';
import CountDownTimer from './CountDownTimer';

class Practise extends Component {

    constructor(props) {
        super(props);

        this.state = {

            num1: 0,
            num2: 0,
            id: 0,

            stopStopWatch: false,
            stopProblemTimer: false,

            solvedTime: '',
            totalRightAns: 0,

            stopCountDown: false,
        };
    }

    
    componentDidMount() {
        if (
            this.props.setupInfo.num1Range !== undefined && 
            this.props.setupInfo.num2Range !== undefined && 
            this.props.setupInfo.op !== undefined
        ) {
            this.props.clearProblems();
            this.genProblems();
            window.onbeforeunload = (e) => {
                return 'Do you want to end the exercise?';
            }
        }
    }


    componentWillUnmount() {
        // Remove the prompt during exercise interruption
        
        window.onbeforeunload = null;
    }

    genProblems = () => {
        let num1 = Math.floor(
            Math.random() * (
                this.props.setupInfo.num1Range.to - this.props.setupInfo.num1Range.from
                )
            ) + this.props.setupInfo.num1Range.from;

        
        let num2 = 0;

        do {
            num2 =  Math.floor(
                Math.random() * (
                    this.props.setupInfo.num2Range.to - this.props.setupInfo.num2Range.from
                    )
                ) + this.props.setupInfo.num2Range.from;

        } while (num2 > num1);
        

        this.setState((state, props) => {
            return {
                num1,
                num2,
                id: state.id + 1,
            }
        });

    }

    updateStore = (rightAns) => {
        // push into the store
        this.setState((state, props) => {

            if (rightAns) {
                return {
                    totalRightAns: state.totalRightAns + 1
                };
            }

        });

        this.genProblems();
    }

    stop = () => {

        this.setState({ stopStopWatch: true, stopProblemTimer: true, stopCountDown: true });

        if (window.confirm("Do you want to stop?")) {
            this.gotoSummary();
            
        } else {
            this.setState({ stopStopWatch: false, stopProblemTimer: false, stopCountDown: false });
        }
    }


    gotoSummary = () => {
        this.props.addRightAns(this.state.totalRightAns);
        this.props.addTimer(this.state.solvedTime);
        
        this.props.history.push('/summary');
    }
    


    finishPractise = (time, timeInFormat) => {
        
        this.setState({
            solvedTime: timeInFormat
        }, () => {
            if (time === 0) {
                this.gotoSummary(); 
            }
        })
    }

    render() {
        return (
            <div>
                {
                   ( 
                       this.props.setupInfo.num1Range !== undefined && 
                       this.props.setupInfo.num2Range !== undefined && 
                       this.props.setupInfo.op !== undefined
                    )
                    ?
                    <div>
                        <div className="row">
                            <div className="col-md-6">
                                <h1>Practise problems</h1>
                            </div>

                            <div className="col-md-6">
                                { 
                                    this.props.setupInfo.isTimeBound 

                                    ?

                                    <CountDownTimer startTime={this.props.setupInfo.timeBound} stop={this.state.stopCountDown} currentTime={this.finishPractise} />

                                    :
                                    
                                    <StopWatch stop={this.state.stopStopWatch} currentTime={(time) => this.setState({solvedTime: time})} />
                                }
                            </div>
                        </div>
                        <VisibleProblem num1={this.state.num1} num2={this.state.num2}
                                op={this.props.setupInfo.op} id={this.state.id} 
                                showResult={false} updateResult={this.updateStore}
                                stopTimer={this.state.stopProblemTimer} />

                        <button className="btn btn-primary" onClick={this.stop}>Stop</button>
                    </div>
                    :
                    <div> 
                        <h1>Sorry, the app isn't set properly.</h1>
                        <small>
                            What's the 1<sup>st</sup> and 2<sup>nd</sup> number's length.
                            <div>
                                What's the operator?
                            </div>
                        </small>
                    </div>
                }
                
            </div>
        );
    }


}

export default withRouter(Practise);