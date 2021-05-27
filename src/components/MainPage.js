import { faLevelUpAlt } from '@fortawesome/free-solid-svg-icons';
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

                timeBound: {
                    isTimeBound: false,
                    timeBoundTypes: {
                        all: false,
                        individual: false
                    },
                    all: { totalTime: '' },
                    individual: { noOfProblems: '', problemTime: '' }
                }

            },

            operatorSelectedAtleastOnce: false,

            isOperatorSet: false,

            sameAsNum1Range: false,
            enableCheckbox: false,

            num1Validations: {

                from: {
                    inValid: false,
                    valMsg: ''
                },

                to: {
                    inValid: false,
                    valMsg: ''
                }

            },


            num2Validations: {

                from: {
                    inValid: false,
                    valMsg: ''
                },

                to: {
                    inValid: false,
                    valMsg: ''
                }

            },


            timeBoundValidations: {
                totalTimeInvalid: false,
                totalTimeBoundValMsg: '',

                totalNoOfProblemsInvalid: false,
                totalNoOfProblemsValMsg: '',

                problemTimeInvalid: false,
                problemTimeValMsg: ''
            }

        };

        this.totalTimeControl = React.createRef();
        this.totalProblemsControl = React.createRef();
    }

    componentDidMount() {
        this.props.clearSetupInfo();
    }

    checkControls = (e) => {


        e.preventDefault();


        const validations = {
            timeBoundValidations: {
                ...this.state.timeBoundValidations
            },
            num1Validations: {
                ...this.state.num1Validations
            },
            num2Validations: {
                ...this.state.num2Validations
            },

            operatorSelectedAtleastOnce: true
        };


        if (this.state.data.num1Range.from === '') {
            validations.num1Validations.from.inValid = true;
            validations.num1Validations.from.valMsg = "Please enter a positive number";
        }

        if (this.state.data.num1Range.to === '') {
            validations.num1Validations.to.inValid = true;
            validations.num1Validations.to.valMsg = "Please enter a positive number";
        }


        if (this.state.data.num2Range.from === '') {
            validations.num2Validations.from.inValid = true;
            validations.num2Validations.from.valMsg = "Please enter a positive number";
        }


        if (this.state.data.num2Range.to === '') {
            validations.num2Validations.to.inValid = true;
            validations.num2Validations.to.valMsg = "Please enter a positive number";
        }


        if (this.state.data.timeBound.isTimeBound &&
            this.state.data.timeBound.timeBoundTypes.all &&
            this.state.data.timeBound.all.totalTime === ''
        ) {
            validations.timeBoundValidations.totalTimeInvalid = true;
            validations.timeBoundValidations.totalTimeBoundValMsg = 'How long do you want to exercise?';
        }


        if (this.state.data.timeBound.isTimeBound &&
            this.state.data.timeBound.timeBoundTypes.individual &&
            this.state.data.timeBound.individual.noOfProblems == ''
        ) {
            validations.timeBoundValidations.totalNoOfProblemsInvalid = true;
            validations.timeBoundValidations.totalNoOfProblemsValMsg = 'How many problems?';
        }


        if (this.state.data.timeBound.isTimeBound &&
            this.state.data.timeBound.timeBoundTypes.individual &&
            this.state.data.timeBound.individual.problemTime == ''
        ) {
            validations.timeBoundValidations.problemTimeInvalid = true;
            validations.timeBoundValidations.problemTimeValMsg = 'Enter some time';
        }


        this.setState({
            ...validations
        }, this.onSubmit);


    }

    onSubmit = () => {

        if (
            // check if the ranges are valid or not
            this.state.num1Validations.from.inValid ||
            this.state.num1Validations.to.inValid ||
            this.state.num2Validations.from.inValid ||
            this.state.num2Validations.to.inValid ||

            !this.state.isOperatorSet ||
            (
                // If option #1 is not set when we want the exercise to be timebound
                (
                    this.state.data.timeBound.isTimeBound &&
                    this.state.data.timeBound.timeBoundTypes.all &&
                    this.state.timeBoundValidations.totalTimeInvalid
                )

                ||

                // or option #2 is not set when we want the exercise to be timebound
                (
                    this.state.data.timeBound.isTimeBound &&
                    this.state.data.timeBound.timeBoundTypes.individual &&
                    this.state.timeBoundValidations.totalNoOfProblemsInvalid &&
                    this.state.timeBoundValidations.problemTimeInvalid
                )
            )
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
            this.setState(prevState => ({

                num1Validations: {
                    ...prevState.num1Validations,
                    from: {
                        inValid: true,
                        valMsg: "It's greater than Num1's Range \"to\". It has to be less"
                    }
                }

            }));
        else {
            this.setState(prevState => ({

                num1Validations: {
                    ...prevState.num1Validations,
                    from: {
                        inValid: false,
                        valMsg: ""
                    }
                }

            }));
        }
    }


    validateNum2Range = () => {
        if (
            this.state.data.num2Range.to !== '' && 
            this.state.data.num2Range.from > this.state.data.num2Range.to
        ) {
            this.setState(prevState => ({

                num2Validations: {
                    ...prevState.num2Validations,
                    from: {
                        inValid: true,
                        valMsg: "It's greater than Num2's Range \"to\". It has to be less"
                    }
                }
            }));
        } else if (
            this.state.data.num2Range.from !== '' &&
            (this.state.data.num2Range.from >= this.state.data.num1Range.to || this.state.data.num2Range.from < this.state.data.num1Range.from)
        ) {

            let isEqualMsg = "";

            if (this.state.data.num2Range.from === this.state.data.num1Range.to) {
                isEqualMsg = `It shouldn't be equal to Num1's "to"`;
            }

            this.setState(prevState => ({

                num2Validations: {
                    ...prevState.num2Validations,
                    from: {
                        inValid: true,
                        valMsg: `Please give a number which is within Num1's range. ${isEqualMsg}`
                    }
                }
            }));

        } else if (
            this.state.data.num2Range.to !== '' &&
            (this.state.data.num2Range.to > this.state.data.num1Range.to || this.state.data.num2Range.to < this.state.data.num1Range.from)
        ) {
            this.setState(prevState => ({

                num2Validations: {
                    ...prevState.num2Validations,
                    to: {
                        inValid: true,
                        valMsg: `Please give a number which is within Num1's range`
                    }
                }
            }));

        } else {
            this.setState(prevState => ({

                num2Validations: {
                    to: {
                        inValid: false,
                        valMsg: ''
                    },

                    from: {
                        inValid: false,
                        valMsg: ''
                    }
                }
            }));
        }
    }

    setTimeBound = () => {
        this.setState(prevState => ({
            data: {
                ...prevState.data,
                timeBound: {
                    ...prevState.data.timeBound,
                    isTimeBound: !prevState.data.timeBound.isTimeBound,

                    timeBoundTypes: {
                        all: !prevState.data.timeBound.isTimeBound,
                        individual: false
                    },

                    all: { totalTime: '' },
                    individual: { noOfProblems: '', problemTime: '' }
                }
            },

            timeBoundValidations: {
                ...prevState.timeBoundValidations,

                totalTimeInvalid: false,
                totalTimeBoundValMsg: '',

                totalNoOfProblemsInvalid: false,
                totalNoOfProblemsValMsg: '',

                problemTimeInvalid: false,
                problemTimeValMsg: ''

            }
        }), () => {
            this.totalTimeControl.current.focus();
        });

    }


    numberValidations(strNum) {

        let validMsg = "";
        let valid = true;

        if (strNum === "") {
            validMsg = "Please enter number";
            valid = false;
        } else if (/^(\d+)?\.\d+$/g.test(strNum)) {
            validMsg = "Decimal numbers not allowed";
            valid = false;
        } else if (/^\-\d+$/g.test(strNum)) {
            validMsg = "Negative numbers are not allowed";
            valid = false;
        } else if (!/^\d+$/g.test(strNum)) {
            validMsg = "Only numbers allowed";
            valid = false;
        }


        return {
            validMsg,
            valid
        };
    }

    timeValidationsForTotalTime(strTime, prevValidations) {

        let validMsg = prevValidations.validMsg;
        let valid = prevValidations.valid;

        if (parseInt(strTime) > 3600) {
            validMsg = "Sorry, you cannot practise for more than an hour at a given time";
            valid = false;
        } else if (parseInt(strTime) === 0) {
            validMsg = "Sorry, you cannot enter 0. You'll need some time to solve";
            valid = false;
        }

        return {
            validMsg,
            valid
        };
    }


    timeValidationsForProblemTime(strTime, prevValidations) {
        let validMsg = prevValidations.validMsg;
        let valid = prevValidations.valid;

        if (parseInt(strTime) > 20) {
            validMsg = "Sorry, you cannot practise for more than an 20s at a given time";
            valid = false;
        } else if (parseInt(strTime) === 0) {
            validMsg = "Sorry, you cannot enter 0. You'll need some time to solve";
            valid = false;
        }

        return {
            validMsg,
            valid
        };
    }



    validateTotalTime(strTime) {
        let validations = this.numberValidations(strTime);

        return validations.valid ? this.timeValidationsForTotalTime(strTime, validations) : validations;
    }

    validateTotalProblems(strNum) {
        return this.numberValidations(strNum);
    }


    validateProblemTime(strTime) {
        let validations = this.numberValidations(strTime);

        return validations.valid ? this.timeValidationsForProblemTime(strTime, validations) : validations;
    }






    setTotalTimeBoundValue = (e) => {
        e.persist();

        let inValue = e.target.value;

        const validations = this.validateTotalTime(inValue);

        this.setState(prevState => ({
            data: {
                ...prevState.data,
                timeBound: {
                    ...prevState.data.timeBound,
                    all: { totalTime: inValue }
                }
            },
            timeBoundValidations: {
                ...prevState.timeBoundValidations,
                totalTimeInvalid: !validations.valid,
                totalTimeBoundValMsg: validations.validMsg
            }

        }));
    }


    setTimeBoundTypes = (e) => {

        const type = {
            all: true,
            individual: false
        };

        const all = { ...this.state.data.timeBound.all };
        const individual = { ...this.state.data.timeBound.individual };

        if (e.target.value === 'individual') {
            type.all = false;
            type.individual = true;

            all.totalTime = '';
        } else {
            individual.noOfProblems = '';
            individual.problemTime = '';

        }


        this.setState(prevState => ({
            data: {
                ...prevState.data,
                timeBound: {
                    ...prevState.data.timeBound,
                    timeBoundTypes: type,
                    all,
                    individual
                }
            },

            timeBoundValidations: {
                totalTimeInvalid: false,
                totalTimeBoundValMsg: '',

                totalNoOfProblemsInvalid: false,
                totalNoOfProblemsValMsg: '',

                problemTimeInvalid: false,
                problemTimeValMsg: ''
            }
        }), () => {

            // focus after the states have been set
            if (this.state.data.timeBound.timeBoundTypes.all) {
                this.totalTimeControl.current.focus();
            } else {
                this.totalProblemsControl.current.focus();
            }

        });
    }


    setTotalProblemValue = (e) => {
        const value = e.target.value;
        const validations = this.numberValidations(value);

        this.setState(prevState => ({
            data: {
                ...prevState.data,
                timeBound: {
                    ...prevState.data.timeBound,
                    individual: {
                        ...prevState.data.timeBound.individual,
                        noOfProblems: value
                    }
                }
            },
            timeBoundValidations: {
                ...prevState.timeBoundValidations,
                totalNoOfProblemsInvalid: !validations.valid,
                totalNoOfProblemsValMsg: validations.validMsg
            }

        }));
    }


    setProblemTimeValue = (e) => {
        const value = e.target.value;
        const validations = this.validateProblemTime(value);

        this.setState(prevState => ({
            data: {
                ...prevState.data,
                timeBound: {
                    ...prevState.data.timeBound,
                    individual: {
                        ...prevState.data.timeBound.individual,
                        problemTime: value
                    }
                }
            },
            timeBoundValidations: {
                ...prevState.timeBoundValidations,
                problemTimeInvalid: !validations.valid,
                problemTimeValMsg: validations.validMsg
            }

        }));
    }

    render() {
        return (
            <div>
                <h1>Arthimetic Practise</h1>

                <form onSubmit={this.checkControls}>
                    <div className="form-group">
                        <label>Num1 Range</label>
                        <div className="form-row">
                            <div className="col-md-3">
                                <input type="number" max="10000"
                                    placeholder="From" value={this.state.data.num1Range.from}
                                    id="num1From" onChange={
                                        e => {

                                            if (e.target.value === "") {

                                                this.setState(prevState => ({
                                                    data: {
                                                        ...prevState.data,
                                                        num1Range: {
                                                            ...prevState.data.num1Range,
                                                            from: ''
                                                        }
                                                    },

                                                    num1Validations: {
                                                        ...prevState.num1Validations,
                                                        from: {
                                                            inValid: true,
                                                            valMsg: 'Please enter something'
                                                        }
                                                    },

                                                    enableCheckbox: false
                                                }));
                                            } else {

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
                                                        enableCheckbox: (
                                                            v &&
                                                            prevState.data.num1Range.to !== '' &&
                                                            !prevState.num1Validations.from.inValid &&
                                                            !prevState.num1Validations.to.inValid
                                                        ),

                                                        num1Validations: {
                                                            ...prevState.num1Validations,
                                                            from: {
                                                                inValid: false,
                                                                valMsg: ''
                                                            }
                                                        }
                                                    };
                                                }, this.validateNum1Range);

                                            }



                                            e.persist();
                                        }
                                    }
                                    className={this.state.num1Validations.from.inValid ? "form-control is-invalid" : "form-control"}
                                    autoFocus
                                />

                                <div className="invalid-feedback" style={{ display: this.state.num1Validations.from.inValid ? 'block' : 'none' }}>
                                    {this.state.num1Validations.from.valMsg}
                                </div>
                            </div>

                            <div className="col-md-3">
                                <input type="number" min="1" max="100000"
                                    placeholder="To" value={this.state.data.num1Range.to}
                                    id="num1To" onChange={
                                        e => {

                                            if (e.target.value === "") {

                                                this.setState(prevState => ({
                                                    data: {
                                                        ...prevState.data,
                                                        num1Range: {
                                                            ...prevState.data.num1Range,
                                                            to: ''
                                                        }
                                                    },

                                                    num1Validations: {
                                                        ...prevState.num1Validations,
                                                        to: {
                                                            inValid: true,
                                                            valMsg: 'Please enter something'
                                                        }
                                                    },

                                                    enableCheckbox: false
                                                }));

                                            } else {

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
                                                        enableCheckbox: (
                                                            v && 
                                                            prevState.data.num1Range.from !== '' &&
                                                            !prevState.num1Validations.from.inValid &&
                                                            !prevState.num1Validations.to.inValid
                                                        ),

                                                        num1Validations: {
                                                            ...prevState.num1Validations,
                                                            to: {
                                                                inValid: false,
                                                                valMsg: ''
                                                            }
                                                        }
                                                    }


                                                }, this.validateNum1Range);

                                            }



                                            e.persist();
                                        }
                                    }
                                    className={this.state.num1Validations.to.inValid ? "form-control is-invalid" : "form-control"}
                                />

                                <div className="invalid-feedback" style={{ display: this.state.num1Validations.to.inValid ? 'block' : 'none' }}>
                                    {this.state.num1Validations.to.valMsg}
                                </div>
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
                                                    sameAsNum1Range: true,

                                                    num2Validations: {
                                                        to: {
                                                            inValid: false,
                                                            valMsg: ''
                                                        },

                                                        from: {
                                                            inValid: false,
                                                            valMsg: ''
                                                        }

                                                    }
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
                                                    sameAsNum1Range: false,

                                                    num2Validations: {
                                                        to: {
                                                            inValid: true,
                                                            valMsg: 'Please enter a positive number'
                                                        },

                                                        from: {
                                                            inValid: true,
                                                            valMsg: 'Please enter a positive number'
                                                        }

                                                    }

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

                                            if (e.target.value === "") {

                                                this.setState(prevState => ({
                                                    data: {
                                                        ...prevState.data,
                                                        num2Range: {
                                                            ...prevState.data.num2Range,
                                                            from: ''
                                                        }
                                                    },

                                                    num2Validations: {
                                                        ...prevState.num2Validations,
                                                        from: {
                                                            inValid: true,
                                                            valMsg: 'Please enter something'
                                                        }
                                                    }
                                                }));

                                            } else {

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
                                                            prevState.data.num1Range.to === prevState.data.num2Range.to,

                                                        num2Validations: {
                                                            ...prevState.num2Validations,
                                                            from: {
                                                                inValid: false,
                                                                valMsg: ''
                                                            }
                                                        }
                                                    };
                                                }, this.validateNum2Range);

                                            }



                                            e.persist();
                                        }
                                    }
                                    className={this.state.num2Validations.from.inValid ? "form-control is-invalid" : "form-control"}
                                />

                                <div className="invalid-feedback" style={{ display: this.state.num2Validations.from.inValid ? 'block' : 'none' }}>
                                    {this.state.num2Validations.from.valMsg}
                                </div>
                            </div>

                            <div className="col-md-3">
                                <input type="number" min="1" max="100000"
                                    placeholder="To" value={this.state.data.num2Range.to}
                                    id="num2To" onChange={
                                        e => {

                                            if (e.target.value === "") {

                                                this.setState(prevState => ({
                                                    data: {
                                                        ...prevState.data,
                                                        num2Range: {
                                                            ...prevState.data.num2Range,
                                                            to: ''
                                                        }
                                                    },

                                                    num2Validations: {
                                                        ...prevState.num2Validations,
                                                        to: {
                                                            inValid: true,
                                                            valMsg: 'Please enter something'
                                                        }
                                                    }
                                                }));

                                            } else {

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
                                                            prevState.data.num1Range.from === prevState.data.num2Range.from,

                                                        num2Validations: {
                                                            ...prevState.num2Validations,
                                                            to: {
                                                                inValid: false,
                                                                valMsg: ''
                                                            }
                                                        }
                                                    }


                                                }, this.validateNum2Range);


                                            }



                                            e.persist();
                                        }
                                    }
                                    className={this.state.num2Validations.to.inValid ? "form-control is-invalid" : "form-control"}
                                />

                                <div className="invalid-feedback" style={{ display: this.state.num2Validations.to.inValid ? 'block' : 'none' }}>
                                    {this.state.num2Validations.to.valMsg}
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

                    <div className="time-bound-controls">

                        <div className="form-check set-timebound-control">

                            <input className="form-check-input" type="checkbox"
                                name="isTimeBound" id="isTimeBound"
                                checked={this.state.data.timeBound.isTimeBound}
                                onChange={this.setTimeBound}
                            />

                            <label className="form-check-label" htmlFor="isTimeBound">
                                Make the practise time bound
                                </label>

                        </div>

                        <div className="form-row time-bound-options" style={{ display: this.state.data.timeBound.isTimeBound ? ' flex' : 'none' }}>

                            <div className="col-md-3 for-all">

                                <div className="form-check option1">

                                    <input className="form-check-input" type="radio"
                                        name="all" id="all"
                                        value="all"
                                        checked={this.state.data.timeBound.timeBoundTypes.all}
                                        onChange={this.setTimeBoundTypes}
                                    />

                                    <label className="form-check-label" htmlFor="all">
                                        Option #1
                                    </label>

                                </div>

                                <div className="form-group">


                                    <div className="total-time-control">
                                        <label htmlFor="timeBoundControl">Enter the time in seconds</label>
                                        <input
                                            type="text"
                                            className={
                                                this.state.timeBoundValidations.totalTimeInvalid && this.state.data.timeBound.timeBoundTypes.all ?
                                                    "form-control is-invalid" :
                                                    "form-control"
                                            }
                                            id="timeBoundControl"
                                            name="timeBoundControl"
                                            ref={this.totalTimeControl}
                                            value={this.state.data.timeBound.all.totalTime}
                                            onChange={this.setTotalTimeBoundValue}
                                            disabled={this.state.data.timeBound.timeBoundTypes.individual}
                                        />
                                    </div>

                                    <div className="invalid-feedback"
                                        style={{
                                            display: this.state.timeBoundValidations.totalTimeInvalid && this.state.data.timeBound.timeBoundTypes.all ?
                                                'block' :
                                                'none'
                                        }}
                                    >
                                        {this.state.timeBoundValidations.totalTimeBoundValMsg}
                                    </div>

                                </div>


                            </div>
                            <div className="col-md-3 for-individual">
                                <div className="form-check option2">

                                    <input className="form-check-input" type="radio"
                                        name="individual" id="individual"
                                        value="individual"
                                        checked={this.state.data.timeBound.timeBoundTypes.individual}
                                        onChange={this.setTimeBoundTypes}
                                    />

                                    <label className="form-check-label" htmlFor="individual">
                                        Option #2
                                    </label>

                                </div>


                                <div className="individual-controls">
                                    <div className="form-group total-problems-control">


                                        <div className="total-problems-control">
                                            <label htmlFor="total-problem-control">Enter the total no. of problems</label>
                                            <input
                                                type="text"
                                                className={
                                                    this.state.timeBoundValidations.totalNoOfProblemsInvalid && this.state.data.timeBound.timeBoundTypes.individual ?
                                                        "form-control is-invalid" :
                                                        "form-control"
                                                }
                                                id="total-problem-control"
                                                name="total-problem-control"
                                                value={this.state.data.timeBound.individual.noOfProblems}
                                                onChange={this.setTotalProblemValue}
                                                ref={this.totalProblemsControl}
                                                disabled={this.state.data.timeBound.timeBoundTypes.all}
                                            />
                                        </div>

                                        <div className="invalid-feedback"
                                            style={{
                                                display: this.state.timeBoundValidations.totalNoOfProblemsInvalid && this.state.data.timeBound.timeBoundTypes.individual ?
                                                    'block' :
                                                    'none'
                                            }}
                                        >
                                            {this.state.timeBoundValidations.totalNoOfProblemsValMsg}
                                        </div>

                                    </div>


                                    <div className="form-group time-problem-control">


                                        <div className="time-problem-control">
                                            <label htmlFor="time-problem-control">Enter the amount of time for each problem(in seconds)</label>
                                            <input
                                                type="text"
                                                className={
                                                    this.state.timeBoundValidations.problemTimeInvalid && this.state.data.timeBound.timeBoundTypes.individual ?
                                                        "form-control is-invalid" :
                                                        "form-control"
                                                }
                                                id="time-problem-control"
                                                name="time-problem-control"
                                                value={this.state.data.timeBound.individual.problemTime}
                                                onChange={this.setProblemTimeValue}
                                                disabled={this.state.data.timeBound.timeBoundTypes.all}
                                            />
                                        </div>

                                        <div className="invalid-feedback"
                                            style={{
                                                display: this.state.timeBoundValidations.problemTimeInvalid && this.state.data.timeBound.timeBoundTypes.individual ?
                                                    'block' :
                                                    'none'
                                            }}
                                        >
                                            {this.state.timeBoundValidations.problemTimeValMsg}
                                        </div>

                                    </div>



                                </div>


                            </div>
                        </div>
                    </div>



                    <button type="submit" className="btn btn-primary">Start</button>
                </form>
            </div>
        )
    }
}

export default withRouter(MainPage);