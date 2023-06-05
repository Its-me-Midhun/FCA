import React, { Component } from 'react';
const data = [
    {
        "name": "AC",
        "label": "C",
        "class": "calculator-grid-button calculatorspan-two"
    },
    {
        "name": "AC",
        "label": "AC",
        "class": "calculator-grid-button calculatorspan-two"
    },
    {
        "name": "DEL",
        "label": "DEL",
        "class": "calculator-grid-button"
    },
    {
        "name": "/",
        "label": "/",
        "class": "calculator-grid-button"
    },
    {
        "name": "1",
        "label": "1",
        "class": "calculator-grid-button"
    },
    {
        "name": "2",
        "label": "2",
        "class": "calculator-grid-button"
    },
    {
        "name": "3",
        "label": "3",
        "class": "calculator-grid-button"
    },
    {
        "name": "*",
        "label": "x",
        "class": "calculator-grid-button"
    },
    {
        "name": "4",
        "label": "4",
        "class": "calculator-grid-button"
    },
    {
        "name": "5",
        "label": "5",
        "class": "calculator-grid-button"
    },
    {
        "name": "6",
        "label": "6",
        "class": "calculator-grid-button"
    },
    {
        "name": "+",
        "label": "+",
        "class": "calculator-grid-button"
    },
    {
        "name": "7",
        "label": "7",
        "class": "calculator-grid-button"
    },
    {
        "name": "8",
        "label": "8",
        "class": "calculator-grid-button"
    },
    {
        "name": "9",
        "label": "9",
        "class": "calculator-grid-button"
    },
    {
        "name": "-",
        "label": "-",
        "class": "calculator-grid-button"
    },
    {
        "name": ".",
        "label": ".",
        "class": "calculator-grid-button"
    },
    {
        "name": "0",
        "label": "0",
        "class": "calculator-grid-button"
    },
    {
        "name": "=",
        "label": "=",
        "class": "calculator-grid-button calculatorspan-two"
    }
]
class KeyPadComponent extends Component {

    render() {
        let calculator = data.map((key, i) => {
            return (
                <button key={i} name={key.name} onClick={e => this.props.onClick(e.target.name)} className={key.class}>{key.label}</button>
            )
        })
        return (
            <div className="calculator-grid">
                {calculator}
            </div>
        );
    }
}


export default KeyPadComponent;