import React, {useState} from 'react';
import './App.css';
import {Add, ArrowDownward} from '@material-ui/icons'
import {Button, Toolbar, AppBar, Typography, Fab} from '@material-ui/core'
import axios from 'axios'


function App() {
  const [state, setState] = useState({
      displayDownLoadButton: false,
      downloadUrl: null
  })

  const getInformation = async ()=>{
    console.log('I was pressed')
    const response = await axios.post('http://localhost:1234')
    if(response.data){
      console.log(response.data)
      let blob = new Blob([response.data], { type: 'application/csv' }),
      url = window.URL.createObjectURL(blob)
      setState({
        displayDownLoadButton: true,
        url:url
      })
    }
  }
  return (
    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', height: '20vh'}}>
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

      {
        state.displayDownLoadButton 
        ? (
          <a href={state.url} download='download.csv'>
            <Fab color='secondary' aria-label="Add" >
              <ArrowDownward />
            </Fab>
          </a>
        )
      : null
      }
    </div>
  );
}



export default App;
