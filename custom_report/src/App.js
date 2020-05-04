import React, { Component } from 'react';
import './App.css';
import SimpleSelect from './SimpleSelect.js';
import MaterialUIPickers from './MaterialUIPickers.js';
import ChipCom from './Chip.js';
import NavCom from './Nav.js';
import Button from '@material-ui/core/Button';
import truck from './truck.png'; 
import tags from './tags.png'; 
import columns from './columns.png'; 
import cal from './cal.png'; 
var moment = require('moment');
var fetch = require('node-fetch');

 var inputStyle = {
    margin: 30
  };

   var div = {
    float: "left",
    minWidth: 50,
    margin: 7
  };

   var diva = {
    clear: "left"
  };

class App extends Component {

        constructor(props) {
          super(props);
          this.state = {startdate: '2020-04-01', starttime: '00:00:00', enddate: '2020-04-01', endtime: '23:59:59', 
          tags: ['tags did not load'], tagNameArr: [], tagIdString : '', reportButton: '', errorreport: '',
          fieldsChosen: [], reportType: ''};

          this.tagDict = {};
          this.tagNames = [];
          this.driversArr=[];
          this.numDays = 0;
          this.dailyLogErrorCounter = 0;
          this.csvArray = [];
          this.csvRow = [];
          this.driverLength = 0;
          this.handleSubmit = this.handleSubmit.bind(this);
          this.fromChildStateDate = this.fromChildStateDate.bind(this);
          this.fromChildStateType = this.fromChildStateType.bind(this);
          this.fromChildStateChips = this.fromChildStateChips.bind(this);
        }

        downloadCSV() {
          //var totalExpectedRows = this.driverLength*this.numDays + this.dailyLogErrorCounter*this.numDays;
          var tempRow;
          var fieldString = this.state.fieldsChosen.join(',');
          var csv = fieldString + '\n';
          this.csvArray.forEach(function(row) {
            tempRow = row.join(',');
            tempRow = tempRow.replace(';', ',');
            csv += tempRow;
            csv += "\n";
          });
          var hiddenElement = document.createElement('a');
          hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
          hiddenElement.target = '_blank';
          hiddenElement.download = 'Samsara_Report_'+this.state.startdate+'_'+this.state.enddate+'_'+this.driverLength+'.csv';
          hiddenElement.click();
          this.setState({reportButton: ""});
          
        }

        getTags() {
          let name = '';
          this.tagDict = {};
          this.tagNames = [];
          fetch("http://localhost:9000/tags")
            .then(res => res.json())
            .then(res => { 
              for (var i in res.data){
                console.log(res.data[i]);
                this.tagNames.push(res.data[i]['name']);
                name = res.data[i]['name'];
                this.tagDict[name]=res.data[i]['id'];
              };

              this.setState({ tagDict: this.tagDict, tagNameArr: this.tagNames}); 
              });
        }

        async getIdleFuel(driverTimezone,driverid,startDateRFC3339,endDateRFC3339){
          startDateMs = await this.getDriverRelativeDate(driverTimezone,startDateMs);
          endDateMs = await this.getDriverRelativeDate(driverTimezone,endDateMs);
          const IdleFuelResponse = await fetch('http://localhost:9000/fleet/drivers/efficiency?driverIds='+driverid+'&startTime='+startDateRFC3339+'&endTime='+endDateRFC3339)
          const IdleFuelInJson = await IdleFuelResponse.json();
          return IdleFuelInJson;
        }

        async getDriverRelativeDate(driverTimezone,dateArg){
          if(driverTimezone === "America/Denver" && moment(dateArg).isDST() === false){
            dateArg = dateArg + (7*3600000);
          }else if(driverTimezone === "America/Denver" && moment(dateArg).isDST() === true){
            dateArg = dateArg + (6*3600000);
          }else if(driverTimezone === "America/New_York" && moment(dateArg).isDST() === false){
            dateArg = dateArg + (5*3600000);
          }else if(driverTimezone === "America/New_York" && moment(dateArg).isDST() === true){
            dateArg = dateArg + (4*3600000);
          }else if(driverTimezone === "America/Phoenix"){
            dateArg = dateArg + (7*3600000);
          }else if(driverTimezone === "America/Chicago" && moment(dateArg).isDST() === false){
            dateArg = dateArg + (6*3600000);
          }else{
            dateArg = dateArg + (5*3600000);
          }

          return dateArg;
        }

        async getSafetyScore(driverTimezone,driverid,startDateMs,endDateMs){
          startDateMs = await this.getDriverRelativeDate(driverTimezone,startDateMs);
          endDateMs = await this.getDriverRelativeDate(driverTimezone,endDateMs);
          const safetyResponse = await fetch('http://localhost:9000/safety?driverId='+driverid+'&startMs='+startDateMs+'&endMs='+endDateMs)
          const safetyInJson = await safetyResponse.json();
          return safetyInJson;
        }

        async getDrivers(endCursor) {
          const driversResponse = await fetch('http://localhost:9000/drivers?parentTagIds='+this.state.tagIdString+'&after='+endCursor)
          const driversInJson = await driversResponse.json();
          return driversInJson;
        }

        async compileReport (endCursor,startDateMs,endDateMs){

          if(this.state.reportType === 'Driver'){
              let result = await this.getDrivers(endCursor);
              this.driversArr = result.data;
              while(result['pagination']['endCursor'] !== ''){
                result = await this.getDrivers(result['pagination']['endCursor'],startDateMs,endDateMs);
                this.driversArr = this.driversArr.concat(result.data);
              }
              console.log(this.driversArr.length);
              for(var i = 0; i< this.driversArr.length; i++){
                for(var j = 0; j< this.state.fieldsChosen.length; j++){
                  if(this.state.fieldsChosen[j] in this.driversArr[i]){
                    this.csvRow.push(this.driversArr[i][this.state.fieldsChosen[j]])
                  }
                }
                this.csvArray.push(this.csvRow);
                this.csvRow = [];
              }

              if(this.state.fieldsChosen.includes("miles")){
                for(var k = 0; k< this.driversArr.length; k++){
                  let safetyResult = await this.getSafetyScore(this.driversArr[k].timezone,this.driversArr[k].id,startDateMs,endDateMs);
                  this.csvArray[k].push((0.00062137*safetyResult.totalDistanceDrivenMeters).toFixed(2));
                }
              }

              if(this.state.fieldsChosen.includes("idleMs")){
                for(var k = 0; k< this.driversArr.length; k++){
                  let IdleFuelResult = await this.getIdleFuel(this.driversArr[k].timezone,this.driversArr[k].id,startDateMs,endDateMs);
                  this.csvArray[k].push((IdleFuelResult.totalIdleTimeDurationMs).toFixed(2));
                }
              }

              if(this.state.fieldsChosen.includes("MPG")){
                for(var k = 0; k< this.driversArr.length; k++){
                  let IdleFuelResult = await this.getIdleFuel(this.driversArr[k].timezone,this.driversArr[k].id,startDateMs,endDateMs);
                  this.csvArray[k].push((IdleFuelResult.totalFuelConsumedMl).toFixed(2));
                }
              }

              this.setState({reportButton: "Download Report"});
          }

        }


        fromChildStateDate(type, childdata) {
          if(type === "startdate"){
              this.setState({
                startdate: childdata.toISOString().substring(0, 10)
                  }, () => {
              console.log(this.state);
              console.log(childdata);
            });
          }

           if(type === "enddate"){
              this.setState({
                enddate: childdata.toISOString().substring(0, 10)
                  , reportButton: ''}, () => {
              console.log(this.state);
              console.log(childdata);
            });
          }
        }

        fromChildStateType(childdata) {
              this.setState({
                reportType: childdata}, () => {
              console.log(childdata);
            });
        }

        fromChildStateChips(type,childdata) {
            if(type === 'Select Tags'){
              console.log(childdata);
              let tagIdStr = '';
              for(var i=0; i<childdata.length; i++){
                tagIdStr += this.tagDict[childdata[i]] + ',';
              }
              this.setState({tagIdString: tagIdStr});
            }

            if(type === 'Choose Columns'){
              console.log(childdata);
              this.setState({fieldsChosen: childdata});
            }
        }

        showState() {
          console.log(this.state);
        }


        getformatDate(date, time) {
          let dateArr = date.split('-');
          let timeArr = time.split(":");
          let month = parseInt(dateArr[1], 10) - 1;
          let day = parseInt(dateArr[2], 10);
          let year = parseInt(dateArr[0], 10);
          let msDateTime = Date.UTC(year, month, day, timeArr[0], timeArr[1], timeArr[2]);
          return msDateTime;
        }

        getformatDateRFC3339(date, time) {
          let event = new Date(date.concat(' ',time));
          let DateRFC3339 = event.toISOString();
          return DateRFC3339;
        }



      refreshPage(){
          window.location.reload();
      } 

      handleSubmit() {
        this.driversArr = [];
        let totalLength = this.state.startdate.length + this.state.enddate.length;
        this.csvArray = [];
        this.csvRow = [];
        this.dailyLogErrorCounter = 0;
        this.driverLength = 0;
        let startDateMs = this.getformatDate(this.state.startdate, this.state.starttime);
        let startDateRFC3339 = this.getformatDateRFC3339(this.state.startdate, this.state.starttime);

        let endDateMs = this.getformatDate(this.state.enddate, this.state.endtime);
        let endDateRFC3339 = this.getformatDateRFC3339(this.state.enddate, this.state.endtime);

        this.numDays = (endDateMs - startDateMs)/86400000;
        this.numDays = Math.trunc(this.numDays);
        console.log("trunc", this.numDays);
        if(((endDateMs - startDateMs) % 86400000) > 0){
            this.numDays++;
          }
        console.log("numDays", this.numDays);
        let nowDate = new Date();
        let nowUTCDate = Date.UTC(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate(), nowDate.getHours(), nowDate.getMinutes(), nowDate.getUTCSeconds());
        console.log("now set to UTC", nowUTCDate);
        console.log("start set to UTC", startDateMs);
        console.log("end set to UTC", endDateMs);

        if(endDateMs < nowUTCDate){
          this.compileReport('',startDateMs,endDateMs);
          this.setState({reportButton: "Please Wait"});
        }else{
            this.setState({reportButton: "End Date Cannot Be Current/Future Day"});
          }
          
      }    

      componentDidMount(){
          this.getTags();
 
      }

      render() {
            
          return (
          
          <div>
          <NavCom />
          <div style={inputStyle}>

          <div style={diva}>
          <div style={div}><img width="30" height="30" src={truck}></img></div><div style={div}>
          <SimpleSelect choices={['Driver','Route','Vehicle']} title={ "Report Type" } parentCallback = {this.fromChildStateType}/></div></div>
          
          <div style={diva}>
          <div style={div}><img width="30" height="30" src={cal}></img></div><div style={div}>
           <MaterialUIPickers dateTitle={ "Start Date" } parentCallback = {this.fromChildStateDate}/></div></div>

           <div style={diva}>
           <div style={div}><img width="30" height="30" src={cal}></img></div><div style={div}>
           <MaterialUIPickers dateTitle={ "End Date" } parentCallback = {this.fromChildStateDate}/></div></div>

          <div style={diva}>
           <div style={div}><img width="30" height="30" src={tags}></img></div><div style={div}>
           <ChipCom toBeSelected={this.state.tagNameArr} chipTitle={ "Select Tags" } parentCallback={this.fromChildStateChips}/></div></div>

          <div style={diva}>
          <div style={div}><img width="30" height="30" src={columns}></img></div><div style={div}>
           <ChipCom toBeSelected={['id','username','name','timezone','hoursworked','miles', 'idleMs', 'MPG']} chipTitle={ "Choose Columns" } 
             parentCallback={this.fromChildStateChips}/></div></div>

             <div style={diva}>
<br></br><br></br>
          <Button  onClick={() => {this.refreshPage();}} color='default' size='medium'>Reset</Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Button  variant="contained" onClick={() => {this.handleSubmit();}} color='primary' size='medium'>Create Report</Button>
          <br></br>
          <Button   onClick={() => {this.downloadCSV();}} color='default' size='medium'>{this.state.reportButton}</Button></div>
        

        </div>
        </div>


          );
      }
    }

export default App;
