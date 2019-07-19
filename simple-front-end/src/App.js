import React from 'react';
import './App.css';
import {Button, Toolbar, AppBar, Typography} from '@material-ui/core'
import axios from 'axios'

const getInformation = async ()=>{
  console.log('I was pressed')
  const response = await axios.post('http://localhost:1234')
}

function App() {
  return (
    <div>
      <AppBar>
        <Toolbar>
            <Typography>
                Page Scraper
            </Typography>
        </Toolbar>
      </AppBar>
      <Button
        onClick={getInformation}
        color='primary'
        variant="contained"
      >
        Get Information
      </Button>
    </div>
  );
}



export default App;
