const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())

app.post('/', (req, res)=>{
    console.log('I have been hit')
    res.status(200).send('Hello there')
})

const port = process.env.port || 1234

app.listen(port, ()=>{
    console.log('I am working now')
})