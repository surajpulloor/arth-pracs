import React, { Component } from "react";

import Problem from './Problem';
import '../styles/ProblemList.css';

class ProblemList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            problems: []
        }
    }

    componentDidMount() {
        this.setState({
            problems: this.structureProblems()
        });
    }


    structureProblems() {
        const problems = [];

        let count = 1;
        let problemList = []

        for (let problem of this.props.problems) {

            // Add an id to every problem
            problem.id = count;
            
            problemList.push(problem);


            if (count % 3 === 0 || count === this.props.problems.length) {
                problems.push(problemList);
                problemList = [];
            }

            count++;
        }

        return problems;
    }


    render() {
        return (
            <div className="problems-list">
                {
                    this.state.problems.map((problems, rindex) => (
                        <div className="row problem-list" key={'r' + rindex}>
                            {
                                problems.map((problem, index) =>  (
                                    <div className="col-md-4" key={'c' + problem.id}>
                                        <Problem key={problem.id} num1={problem.num1} num2={problem.num2}
                                                op={problem.op} res={problem.res} timeTaken={problem.timeTaken}
                                                id={problem.id} showResult={true} />
                                    </div>
                                ))
                            }
                            
                        </div>
                    ))
                    
                }
            </div>
        );
    }
}


export default ProblemList;