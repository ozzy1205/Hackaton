import React, { Component } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';


 var inputStyle = {
    minWidth: 222,
    margin: 0,
  };

  var inputStyleChip = {
    margin: 2,
  };


class ChipCom extends Component { 
   constructor(props) 
    { 
        super(props); 
        this.state = {"theSelected":[]};
        this.handleChange = this.handleChange.bind(this);
    } 

    handleChange(event) {
       this.props.parentCallback(this.props.chipTitle,event.target.value);
       this.setState({theSelected: event.target.value});
            };

render() 
    { 
  return (
    <div>

      <FormControl style={inputStyle}>
        <InputLabel  id="demo-mutiple-chip-label">{this.props.chipTitle}</InputLabel>
        <Select
          labelId="demo-mutiple-chip-label"
          id="demo-mutiple-chip"
          multiple
          value={this.state.theSelected}
          onChange={this.handleChange}
          input={<Input id="select-multiple-chip" />}
          renderValue={(selected) => (
            <div >
              {selected.map((value) => (
                <Chip key={value} label={value} style={inputStyleChip}/>
              ))}
            </div>
          )}

        >
          {this.props.toBeSelected.map((name) => (
            <MenuItem key={name} value={name} >
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
     
    </div>
  );
}
}

export default ChipCom; 
