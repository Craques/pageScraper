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
    res.status(200).download(__dirname + '/secondTry')
    //res.download(__dirname, + '/secondTry')
    // vo(scrapePage)(
    //     (err, results)=>{
    //         console.log(err)
    //         if(results){
    //             (async()=>{
    //                 const csv = new ObjectsToCsv(results)
    //                 await csv.toDisk('./secondTry')
    //                 console.log('I am done')
    //                 //res.sendFile(__dirname + '/secondTry')
    //                 res.download(__dirname + '/secondTry')
    //                 //res.json({wata: 'I am worrking boy'})
    //             })()
    //         }else if(err){
    //             console.log(err)
    //         }
    //     }
    // )
    //res.status(200).send('Hello there')
})

const port = process.env.port || 1234

app.listen(port, ()=>{
    console.log('I am working now')
})