const express = require('express')
const cors = require('cors')
const app = express()
const {scrapePage} = require('./scraper')
const vo =require('vo')
const ObjectsToCsv = require('objects-to-csv')

app.use(cors())

app.post('/', (req, res)=>{
    console.log('I have been hit')
    //scrapePage()
    vo(scrapePage)(
        (err, results)=>{
            console.log(err)
            if(results){
                (async()=>{
                    const csv = new ObjectsToCsv(results)
                    await csv.toDisk('./secondTry')
                    console.log('I am done')
                })()
            }else if(err){
                console.log(Error)
            }
        }
    )
    res.status(200).send('Hello there')
})

const port = process.env.port || 1234

app.listen(port, ()=>{
    console.log('I am working now')
})