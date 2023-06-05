import React, {Component} from 'react';
import {Multiselect} from 'multiselect-react-dropdown';

class MultiSelectCommon extends Component {
    render() {
        const {options, selectedValues, onSelect, displayValue, className} = this.props
        return (
            <React.Fragment>
                <Multiselect
                    options={options}
                    // selectedValues={selectedValues}
                    onSelect={onSelect}
                    className={className}
                    displayValue={displayValue}
                />
            </React.Fragment>
        )
    }
}

export default MultiSelectCommon;
