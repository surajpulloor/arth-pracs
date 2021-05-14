import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import '../styles/MainPage.css';


class MainPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: {
                num1Range: {
                    from: '',
                    to: '',
                },
                num2Range: {
                    from: '',
                    to: '',
                },
                ops: {
                    add: false,
                    subtract: false,
                    multiply: false,
                    divide: false
                },


                isTimeBound: false,
                timeBound: ''
            },

            operatorSelectedAtleastOnce: false,

            isOperatorSet: false,

            sameAsNum1Range: false,
            enableCheckbox: false,

            num1ValidationFailure: false,
            num1ValidationMessage: '',

            num2ValidationFailureTo: false,
            num2ValidationMessageTo: '',

            timeInvalid: false,
            timeBoundValMsg: ''
        };

        this.ref = React.createRef();
    }

    componentDidMount() {
        this.props.clearSetupInfo();
    }

    onSubmit = (e) => {
        e.preventDefault();

        if (
            this.state.num1ValidationFailure ||
            this.state.num2ValidationFailure ||
            this.state.num2ValidationFailureTo ||
            !this.state.isOperatorSet ||

            this.state.data.isTimeBound &&
            this.state.timeInvalid
        )
            return false;


        // Convert timeBound to an int before going to the next page
        this.setState((state, props) => {

            if (state.data.isTimeBound) {
                return {
                    data: {
                        ...state.data,
                        timeBound: parseInt(state.data.timeBound)
                    }
                }
            }

        }, () => {
            // call props.onStart
            this.props.onSetup(this.state.data);


            this.props.history.push('/practise');
        });


    }

    getChoiceValue = (e) => {

        const ops = this.state.data.ops;

        switch (e.target.value) {
            case '+':
                ops.add = !ops.add;
                break;

            case '-':
                ops.subtract = !ops.subtract;
                break;

            case '*':
                ops.multiply = !ops.multiply;
                break;

            case '/':
                ops.divide = !ops.divide;
                break;
        }

        this.setState(prevState => ({
            data: {
                ...prevState.data,
                ops: ops
            },

            
            operatorSelectedAtleastOnce: true,
            isOperatorSet: this.checkOpsSet(ops)
        }));

        e.persist();
    }


    checkOpsSet(ops) {

        return ops.add || ops.subtract || ops.multiply || ops.divide;

    }


    validateNum1Range = () => {
        if (this.state.data.num1Range.to !== '' && this.state.data.num1Range.from > this.state.data.num1Range.to)
            this.setState({ num1ValidationFailure: true, num1ValidationMessage: "It's greater than Num1's Range \"to\". It has to be less" });
        else
            this.setState({ num1ValidationFailure: false, num1ValidationMessage: "" });
    }


    validateNum2Range = () => {
        if (this.state.data.num2Range.to !== '' && this.state.data.num2Range.from > this.state.data.num2Range.to)
            this.setState({
                num2ValidationFailure: true,
                num2ValidationMessage: "It's greater than Num2's Range \"to\". It has to be less",

                num2ValidationFailureTo: false,
                num2ValidationMessageTo: ''
            });

        else if (
            this.state.data.num1Range.from !== '' &&
            this.state.data.num2Range.from > this.state.data.num1Range.from
        )
            this.setState({
                num2ValidationFailure: true,
                num2ValidationMessage: 'Num2 "from" is greater than Num1 "from"',

                num2ValidationFailureTo: false,
                num2ValidationMessageTo: ''
            });

        else if (
            this.state.data.num1Range.to !== '' &&
            this.state.data.num2Range.to > this.state.data.num1Range.to
        )
            this.setState({
                num2ValidationFailureTo: true,
                num2ValidationMessageTo: 'Num2 "to" is greater than Num1 "to"',

                num2ValidationFailure: false,
                num2ValidationMessage: ''

            });

        else
            this.setState({
                num2ValidationFailure: false,
                num2ValidationMessage: "",

                num2ValidationFailureTo: false,
                num2ValidationMessageTo: ''
            });
    }

    setTimeBound = () => {
        this.setState(prevState => ({
            data: {
                ...prevState.data,
                isTimeBound: !prevState.data.isTimeBound,
                timeBound: ''
            },
            timeInvalid: true,
            timeBoundValMsg: 'Please enter a number'
        }), () => {
            this.ref.current.focus();
        });

    }


    setTimeBoundValue = (e) => {
        e.persist();

        let validMsg = "";
        let valid = true;

        let inValue = e.target.value;

        if (inValue === "") {
            validMsg = "Please enter number";
            valid = false;
        } else if (/^(\d+)?\.\d+$/g.test(inValue)) {
            validMsg = "Decimal numbers not allowed";
            valid = false;
        } else if (/^\-\d+$/g.test(inValue)) {
            validMsg = "Negative numbers are not allowed";
            valid = false;
        } else if (!/^\d+$/g.test(inValue)) {
            validMsg = "Only numbers allowed";
            valid = false;
        } else if (parseInt(inValue) > 3600) {
            validMsg = "Sorry, you cannot practise for more than an hour at a given time";
            valid = false;
        } else if (parseInt(inValue) === 0) {
            validMsg = "Sorry, you cannot enter 0. You'll need some time to solve";
            valid = false;
        }

        this.setState(prevState => ({
            data: {
                ...prevState.data,
                timeBound: inValue
            },
            timeInvalid: !valid,
            timeBoundValMsg: validMsg
        }));
    }

    render() {
        return (
            <div>
                <h1>Arthimetic Practise</h1>

                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Num1 Range</label>
                        <div className="form-row">
                            <div className="col-md-3">
                                <input type="number" min="1" max="100000"
                                    placeholder="From" value={this.state.data.num1Range.from}
                                    id="num1From" onChange={
                                        e => {

                                            this.setState(prevState => {
                                                const num1Range = Object.assign({}, prevState.data.num1Range);
                                                const v = parseInt(e.target.value);
                                                num1Range.from = v ? v : "";

                                                const num2Range = Object.assign({}, prevState.data.num2Range);
                                                if (prevState.sameAsNum1Range)
                                                    num2Range.from = num1Range.from;

                                                return {
                                                    data: {
                                                        ...prevState.data,
                                                        num1Range,
                                                        num2Range
                                                    },
                                                    sameAsNum1Range: v || prevState.data.num1Range.to !== '' ? prevState.sameAsNum1Range : false,
                                                    enableCheckbox: v && prevState.data.num1Range.to !== '' ? true : false
                                                };
                                            }, this.validateNum1Range);

                                            e.persist();
                                        }
                                    }
                                    className={this.state.num1ValidationFailure ? "form-control is-invalid" : "form-control"}
                                    autoFocus
                                    required
                                />

                                <div className="invalid-feedback" style={{ display: this.state.num1ValidationFailure ? 'block' : 'none' }}>
                                    {this.state.num1ValidationMessage}
                                </div>
                            </div>

                            <div className="col-md-3">
                                <input type="number" min="1" max="100000"
                                    placeholder="To" value={this.state.data.num1Range.to}
                                    id="num1To" onChange={
                                        e => {

                                            this.setState(prevState => {

                                                const v = parseInt(e.target.value);

                                                const to = v ? v : '';


                                                return {
                                                    data: {
                                                        ...prevState.data,
                                                        num1Range: {
                                                            ...prevState.data.num1Range,
                                                            to
                                                        },
                                                        num2Range: {
                                                            ...prevState.data.num2Range,
                                                            to: prevState.sameAsNum1Range ? to : prevState.data.num2Range.to
                                                        }
                                                    },
                                                    sameAsNum1Range: v || prevState.data.num1Range.from !== '' ? prevState.sameAsNum1Range : false,
                                                    enableCheckbox: v && prevState.data.num1Range.from !== '' ? true : false
                                                }


                                            }, this.validateNum1Range);

                                            e.persist();
                                        }
                                    }
                                    className="form-control"
                                    required
                                />
                            </div>

                        </div>

                    </div>

                    <div className="form-group">

                        <div className="num2RangeLabel">
                            <span className="label">Num2 Range</span>

                            <span className="leftParen">
                                (
                            </span>

                            <div className="custom-control custom-checkbox sameRangeCheckbox" style={{ color: this.state.enableCheckbox ? 'black' : 'grey' }}>
                                <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    id="toNum1Range"
                                    disabled={!this.state.enableCheckbox}
                                    checked={this.state.sameAsNum1Range}
                                    onClick={
                                        e => {
                                            e.target.checked

                                                ? this.setState(prevState => ({
                                                    data: {
                                                        ...prevState.data,
                                                        num2Range: {
                                                            to: prevState.data.num1Range.to,
                                                            from: prevState.data.num1Range.from
                                                        }
                                                    },
                                                    sameAsNum1Range: true
                                                }))
                                                :
                                                this.setState(prevState => ({
                                                    data: {
                                                        ...prevState.data,
                                                        num2Range: {
                                                            to: "",
                                                            from: ""
                                                        }
                                                    },
                                                    sameAsNum1Range: false

                                                }))

                                        }
                                    }
                                />
                                <label className="custom-control-label" htmlFor="toNum1Range">Same as Num1 range</label>
                            </div>

                            <span className="rightParen">
                                )
                            </span>
                        </div>


                        <div className="form-row">
                            <div className="col-md-3">
                                <input type="number" min="1" max="100000"
                                    placeholder="From" value={this.state.data.num2Range.from}
                                    id="num2From" onChange={
                                        e => {

                                            this.setState(prevState => {
                                                const num2Range = Object.assign({}, this.state.data.num2Range);
                                                const v = parseInt(e.target.value);
                                                num2Range.from = v ? v : '';

                                                return {
                                                    data: {
                                                        ...prevState.data,
                                                        num2Range
                                                    },
                                                    sameAsNum1Range: !isNaN(v) && v === prevState.data.num1Range.from &&
                                                        prevState.data.num1Range.to === prevState.data.num2Range.to
                                                };
                                            }, this.validateNum2Range);

                                            e.persist();
                                        }
                                    }
                                    className={this.state.num2ValidationFailure ? "form-control is-invalid" : "form-control"}
                                    required
                                />

                                <div className="invalid-feedback" style={{ display: this.state.num2ValidationFailure ? 'block' : 'none' }}>
                                    {this.state.num2ValidationMessage}
                                </div>
                            </div>

                            <div className="col-md-3">
                                <input type="number" min="1" max="100000"
                                    placeholder="To" value={this.state.data.num2Range.to}
                                    id="num2To" onChange={
                                        e => {

                                            this.setState(prevState => {

                                                const v = parseInt(e.target.value);

                                                return {
                                                    data: {
                                                        ...prevState.data,
                                                        num2Range: {
                                                            ...prevState.data.num2Range,
                                                            to: v ? v : ''
                                                        }
                                                    },
                                                    sameAsNum1Range: !isNaN(v) && v === prevState.data.num1Range.to &&
                                                        prevState.data.num1Range.from === prevState.data.num2Range.from
                                                }


                                            }, this.validateNum2Range);

                                            e.persist();
                                        }
                                    }
                                    className={this.state.num2ValidationFailureTo ? "form-control is-invalid" : "form-control"}
                                    required
                                />

                                <div className="invalid-feedback" style={{ display: this.state.num2ValidationFailureTo ? 'block' : 'none' }}>
                                    {this.state.num2ValidationMessageTo}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="operators">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox"
                                name="add" id="add"
                                value="+" checked={this.state.data.ops.add}
                                onChange={this.getChoiceValue}
                            />
                            <label className="form-check-label" htmlFor="add">
                                +
                            </label>
                        </div>

                        <div className="form-check">
                            <input className="form-check-input" type="checkbox"
                                name="subtract" id="subtract"
                                value="-" checked={this.state.data.ops.subtract}
                                onChange={this.getChoiceValue}
                            />
                            <label className="form-check-label" htmlFor="subtract">
                                -
                            </label>
                        </div>

                        <div className="form-check">
                            <input className="form-check-input" type="checkbox"
                                name="multiply" id="multiply"
                                value="*" checked={this.state.data.ops.multiply}
                                onChange={this.getChoiceValue}
                            />
                            <label className="form-check-label" htmlFor="multiply">
                                *
                            </label>
                        </div>

                        <div className="form-check">
                            <input className="form-check-input" type="checkbox"
                                name="divide" id="divide"
                                value="/" checked={this.state.data.ops.divide}
                                onChange={this.getChoiceValue}
                            />
                            <label className="form-check-label" htmlFor="divide">
                                /
                            </label>
                        </div>

                        <div className="operator-error-message" style={{ display: !this.state.isOperatorSet && this.state.operatorSelectedAtleastOnce ? 'block' : 'none' }}>
                            Please set an operator either +, -, *, /
                        </div>
                    </div>
                

                    <hr />

                    <div className="form-check">

                        <input className="form-check-input" type="checkbox"
                            name="isTimeBound" id="isTimeBound"
                            checked={this.state.data.isTimeBound}
                            onChange={this.setTimeBound}
                        />

                        <label className="form-check-label" htmlFor="isTimeBound">
                            Make the practise time bound
                        </label>

                    </div>

                    <div className="form-group" style={{ display: this.state.data.isTimeBound ? 'block' : 'none' }}>
                        <div className="form-row">
                            <div className="col-md-3">
                                <label htmlFor="timeBoundControl">Enter the time in seconds</label>
                                <input
                                    type="text"
                                    className={this.state.timeInvalid ? "form-control is-invalid" : "form-control"}
                                    id="timeBoundControl"
                                    name="timeBoundControl"
                                    ref={this.ref}
                                    value={this.state.data.timeBound}
                                    onChange={this.setTimeBoundValue}
                                />
                            </div>
                        </div>

                        <div className="invalid-feedback" style={{ display: this.state.timeInvalid ? 'block' : 'none' }}>
                            {this.state.timeBoundValMsg}
                        </div>

                    </div>

                    <button type="submit" className="btn btn-primary">Start</button>
                </form>
            </div>
        )
    }
}

export default withRouter(MainPage);