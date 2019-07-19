const express = require('express')

const app = express()

app.post('/', (req, res)=>{
    res.status(200).send('Hello there')
})

const port = process.env.port || 1234

app.listen(port, ()=>{
    console.log('I am working now')
})