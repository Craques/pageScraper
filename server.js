const Nightmare = require('nightmare')
const cheerio = require('cheerio')

const url = 'https://roi.aib.gov.uk/roi/PublicSearches/PublicSearch/'
const nightmare = Nightmare({show: true})

//Initial query
nightmare
.goto(url)
.wait('body')
//.click('button[name="SBForSearch"]
.click('[name="SBForSearch"]')
.wait('table')
.evaluate(()=>document.getElementsByName('PageSize')[0].value = "Page250") //Set each page to be able to display 250 results
.evaluate(()=> document.getElementsByName('Update')[0].click()) //update the amount of results returned
.evaluate(()=>document.getElementsByName("PageNumber")[0].value = 20)//run this step initially and subsequently use page numbers to update
.evaluate(()=>document.getElementsByName("PageNextAction")[0].click())
.wait(7000)
.wait("table tr:nth-child(250)")//wait for the page to load 250 rows
.evaluate(()=>document.querySelector('body').innerHTML)
.end()
.then(response=> getData(response))

//subsequent query

const getHeaders = (html)=>{
    const $ = cheerio.load(html)
    let headers = []
    $('th').each((item, element)=>{
        //console.log($(element).text())
        headers.push($(element).text())
    })
    console.log(headers)
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

    console.log(data[0])
}

function *scrapePage(){

} 