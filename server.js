const express = require('express')
const cors = require('cors')
const app = express()
const {scrapePage} = require('./scraper')
const vo =require('vo')
const co = require('co')
const ObjectsToCsv = require('objects-to-csv')

app.use(cors())

app.post('/', async (req, res)=>{
    console.log('I have been hit')
    co(scrapePage).then((response)=>{
        (async()=>{
            const csv = new ObjectsToCsv(response)
            await csv.toDisk('./secondTry')
            console.log('I am done')
            //res.sendFile(__dirname + '/secondTry')
            res.download(__dirname + '/secondTry')
        })()  
    }).catch((error)=>{
        res.send(error)
        console.log(error)
    })
})

const port = process.env.port || 1234

app.listen(port, ()=>{
    console.log('I am working now')
})