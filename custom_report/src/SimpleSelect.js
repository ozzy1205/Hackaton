import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

  var inputStyle = {
    margin: 0,
    minWidth: 222,
  };

class SimpleSelect extends Component { 

    constructor(props) 
    { 
        super(props); 
        this.state = {"reportType":''};
        this.handleReportChange = this.handleReportChange.bind(this);
    } 

    handleReportChange(event) {
      this.props.parentCallback(event.target.value);
      this.setState({"reportType":event.target.value})
    };



render() 
    {   
     let choices = this.props.choices.map((data) =>
                <MenuItem value={data}>{data}</MenuItem>);
  return (
    <div>
      <FormControl style={inputStyle}>
        <InputLabel id="demo-simple-select-label">{this.props.title}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={this.state.reportType}
          onChange={this.handleReportChange}
        >
          {choices}
        </Select>
      </FormControl>
    </div>
  );
}
}

export default SimpleSelect; 
