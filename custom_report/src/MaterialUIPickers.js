import React, { Component } from 'react';
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

class MaterialUIPickers extends Component { 
    constructor(props) 
    { 
        super(props); 
        this.state = { color : '#4cb96b' , selectedDate : new Date('2020-04-01T00:01:00') }; 
        this.handleDateChange = this.handleDateChange.bind(this);
    } 

  handleDateChange(date) {
    this.setState({'selectedDate': date});
    if(this.props.dateTitle === "Start Date"){
      this.props.parentCallback('startdate', date);
    }
    if(this.props.dateTitle === "End Date"){
      this.props.parentCallback('enddate', date);
    }
  };

 render() 
    { 
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container justify="left" margin="10">
        <KeyboardDatePicker
          margin="normal"
          id="date-picker-dialog"
          label={this.props.dateTitle}
          format="MM/dd/yyyy"
          value={this.state.selectedDate}
          onChange={this.handleDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />

      </Grid>
    </MuiPickersUtilsProvider>
  );
}
}

export default MaterialUIPickers; 
