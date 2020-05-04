import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

 var inputStyle = {
    color: "#17191C",
    backgroundColor: "#f6f7f9"
  };


class NavCom extends Component { 
   constructor(props) 
    { 
        super(props); 

    } 

render() 
    { 
  return (
    <div >
      <AppBar position="static" color='black' style={inputStyle}>
        <Toolbar >
          <IconButton edge="start"  color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" >
            Custom Report Generator
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}
}


export default NavCom; 