import React, { Component } from "react";
import ResultComponent from "./components/Dispaly";
import KeyPadComponent from "./components/Keypad";
import { evaluate, format } from "mathjs";

class Calculator extends Component {
    constructor() {
        super();
        this.state = {
            result: ""
        };
    }
    thousands_separators = num => {
        let number = num.split(".");
        number[0] = number[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return number.join(".");
    };

    onClick = button => {
        if (button === "=") {
            this.calculate();
        } else if (button === "AC") {
            this.reset();
        } else if (button === "DEL") {
            this.backspace();
        } else {
            this.setState({
                result: this.state.result + button
            });
        }
    };

    calculate = () => {
        let checkResult = "";
        if (this.state.result.includes("--")) {
            checkResult = this.state.result.replace("--", "+");
        } else {
            checkResult = this.state.result;
        }
        try {
            //console.log(evaluate(checkResult))
            this.setState({
                result: (evaluate(checkResult) || "0") + ""
            });
        } catch (e) {
            this.setState({
                result: "error"
            });
        }
    };

    reset = () => {
        this.setState({
            result: ""
        });
    };

    backspace = () => {
        this.setState({
            result: this.state.result.slice(0, -1)
        });
    };

    render() {
        return (
            <div>
                <div className="calcbody">
                    <div className="calculatoroutput">
                        <p>{this.thousands_separators(this.state.result)}</p>
                        {/* <textarea value={result}/> */}
                    </div>
                    <KeyPadComponent onClick={this.onClick} />
                </div>
            </div>
        );
    }
}

export default Calculator;
