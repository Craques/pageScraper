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
    return data
}

function *scrapePage(){
    let websiteData = []

    yield nightmare
        .goto(url)
        .wait('body')
        .click('[name="SBForSearch"]')
        .wait('[name="PageSize"]')
        .evaluate(()=>document.getElementsByName('PageSize')[0].value = "Page250") //Set each page to be able to display 250 results
        .evaluate(()=> document.getElementsByName('Update')[0].click()) //update the amount of results returned
        .wait("table tr:nth-child(250)")//wait for the page to load 250 rows
    
    let n = 0    
    while (n<3) {
        if(n === 0){
            const page = yield nightmare.evaluate(()=>document.querySelector('body').innerHTML)
            const data = getData(page)
            websiteData = [...websiteData, ...data]
        }
        
        //goto nextpage
         if(n>0 ){
             yield nightmare.click("[name='PageNextAction']")
            .wait(`input[name="PageNumber"][value="${n}"]`)
            .wait("table tr:nth-child(250)") //condition has to be changed depending on whether or not we are on last page
        
            const page = yield nightmare.evaluate(()=>document.querySelector('body').innerHTML)
            const data = getData(page)
            websiteData = [...websiteData, ...data]
        }
        n++
    }
    
    console.log(websiteData.length)
    yield nightmare.end()
} 