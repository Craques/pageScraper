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
.wait('[name="PageSize"]')
.evaluate(()=>document.getElementsByName('PageSize')[0].value = "Page250") //Set each page to be able to display 250 results
.evaluate(()=> document.getElementsByName('Update')[0].click()) //update the amount of results returned
.wait("table tr:nth-child(250)")//wait for the page to load 250 rows
.click("[name='PageNextAction']")//go to next page
.wait('input[name="PageNumber"][value="1"]')//wait for the pagenumber to change
.evaluate(()=>document.querySelector('body'))
.wait('table')
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

    console.log(data[249])
}

function *scrapePage(){

} 