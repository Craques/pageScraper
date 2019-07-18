const Nightmare = require('nightmare')
const cheerio = require('cheerio')
const vo = require('vo')
const url = 'https://roi.aib.gov.uk/roi/PublicSearches/PublicSearch/'
const nightmare = Nightmare({show: true})
const ObjectsToCsv = require('objects-to-csv')

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

const getHeaders = (html)=>{
    const $ = cheerio.load(html)
    let headers = []
    $('th').each((item, element)=>{
        //console.log($(element).text())
        headers.push($(element).text())
    })

    return headers
}

const getData = (html)=>{
    const headers = getHeaders(html)
    let data = []
    //const item = {}
    
    const $ = cheerio.load(html)
    const tableRows = $('tbody > tr')
    //map over each row and get its inner html and set it to the item
    tableRows.each((rowIndex, element)=>{
        let item
        $(element).find('td').each((itemIndex, itemElement)=>{
            const header = headers[itemIndex]
            item = {...item, [header]: $(itemElement).text()} 
        })

        data.push(item)
    })

    return data
}

function *scrapePage(){
    let websiteData = []
    let totalNumberOfPages = 0
    

    yield nightmare
        .goto(url)
        .wait('body')
        .click('[name="SBForSearch"]')
        .wait('[name="PageSize"]')
        .evaluate(()=>document.getElementsByName('PageSize')[0].value = "Page250") //Set each page to be able to display 250 results
        .evaluate(()=> document.getElementsByName('Update')[0].click()) //update the amount of results returned
        .wait("table tr:nth-child(250)")//wait for the page to load 250 rows
        
    
    totalNumberOfPages = yield nightmare.evaluate(()=>document.querySelector('[name="TotalNumberOfPages"]').value)
    //get the number of search results
    totalNumberOfResultsString = yield nightmare.evaluate(()=>document.querySelector('.text-info > strong').textContent)
    //Extract the number from the text returned to be used to evaluate the last page
    totalNumberOfResults = Number(totalNumberOfResultsString.replace(/[^0-9]/g, ''))
    const lastPageLength = totalNumberOfResults % 250
    

    let n = 250 //should start at -1 so we can get all the results since they start at page 0 
    while (n<totalNumberOfPages-1) { 
        let value = (totalNumberOfPages - 2 === n) ? lastPageLength : 250
       
        if(true){
            console.log(n, value, totalNumberOfPages - 2)
            yield nightmare
            .evaluate((n)=>document.querySelector('input[name="PageNumber"]').value = n, n)
            .evaluate(()=>document.querySelector("[name='PageNextAction']").click())
            .wait(`input[name="PageNumber"][value="${n + 1}"]`)
            .wait(`table tr:nth-child(${value})`) //condition has to be changed depending on whether or not we are on last page
        
            const page = yield nightmare.evaluate(()=>document.querySelector('body').innerHTML)
            const data = getData(page)
            websiteData = [...websiteData, ...data]
        }
        nextExists = yield nightmare.visible("[name='PageNextAction'].disabled")
        n++
        
    }

    yield nightmare.end()
    return websiteData
} 