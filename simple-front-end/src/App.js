import React from 'react';
import './App.css';
import {Button, Toolbar, AppBar, Typography} from '@material-ui/core'

const getInformation = ()=>{
  console.log('I was pressed')
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
