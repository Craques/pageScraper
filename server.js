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
    const results = await co(scrapePage)
    console.log('I got here again')
    if(results){
        return (async()=>{
            const csv = new ObjectsToCsv(results)
            await csv.toDisk('./secondTry')
            console.log('I am done')
            //res.sendFile(__dirname + '/secondTry')
            res.download(__dirname + '/secondTry')
        })()
    }

    return res.status(400).send('There was an error')
})

const port = process.env.port || 1234

app.listen(port, ()=>{
    console.log('I am working now')
})