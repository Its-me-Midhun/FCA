import React, {Component} from 'react';

class ResultComponent extends Component {
    render() {
        let {result} = this.props;
        return (
            <div className="calculatoroutput">
                {/* <p>{result}</p> */}
                <textarea className="custom-input form-control" value={result}/>
            </div>
    )
        ;
    }
}


export default ResultComponent;