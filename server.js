const Nightmare = require('nightmare')
const cheerio = require('cheerio')
const vo = require('vo')
const url = 'https://roi.aib.gov.uk/roi/PublicSearches/PublicSearch/'
const nightmare = Nightmare({show: true})

vo(scrapePage)(
    (err, results)=>{
        return null
    }
)
// nightmare
// .goto(url)
// .wait('body')
// .click('[name="SBForSearch"]')
// .wait('[name="PageSize"]')
// .evaluate(()=>document.getElementsByName('PageSize')[0].value = "Page250") //Set each page to be able to display 250 results
// .evaluate(()=> document.getElementsByName('Update')[0].click()) //update the amount of results returned
// .wait("table tr:nth-child(250)")//wait for the page to load 250 rows
// .click("[name='PageNextAction']")//go to next page
// .wait('input[name="PageNumber"][value="1"]')//wait for the pagenumber to change
// .evaluate(()=>document.querySelector('body'))
// .wait('table') //wait for next page to load
// .evaluate(()=>document.querySelector('body').innerHTML)
// .end()
// .then(response=> getData(response))

//subsequent query

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

    console.log(data[0], data.length)
}

function *scrapePage(){
    let pages = []

    yield nightmare
        .goto(url)
        .wait('body')
        .click('[name="SBForSearch"]')
        .wait('[name="PageSize"]')
        .evaluate(()=>document.getElementsByName('PageSize')[0].value = "Page250") //Set each page to be able to display 250 results
        .evaluate(()=> document.getElementsByName('Update')[0].click()) //update the amount of results returned
        .wait("table tr:nth-child(250)")//wait for the page to load 250 rows
    
    let n = 0    
    while (n<10) {
        const page = yield nightmare.evaluate(()=>document.querySelector('body').innerHTML)
        pages.push(page)
        getData(page)
        //goto nextpage
        yield nightmare.click("[name='PageNextAction']")
            .wait(`input[name="PageNumber"][value="${n}"]`)
            .wait("table tr:nth-child(250)") //condition has to be changed depending on whether or not we are on last page
        
        n++
    }
    console.log("Pages", pages.length)
    yield nightmare.end()
} 