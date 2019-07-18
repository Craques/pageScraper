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

/**
 * @function getHeaders gets the headers that are to be assigned to the webpage details
 * @param {string} html - the html content of the page
 * @returns {array} headers - the headings of each page 
 */
const getHeaders = (html)=>{
    const $ = cheerio.load(html)
    let headers = []
    $('th').each((item, element)=>{
        //console.log($(element).text())
        headers.push($(element).text())
    })

    return headers
}

/**
 * 
 * @param {string} html - the page to extract the data from
 * @returns {array} data - an array of all the elements on the search results page
 */
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
            //get link for each row
            const link =$(itemElement).find('a').attr('href')
            const header = headers[itemIndex]
            //if the Item has a link use that instead
            item = {...item, [header]: link ? link : $(itemElement).text()} 
        })

        data.push(item)
    })

    return data
}

/**
 * @function
 * @param {string} html- the body of the page to extract information from
 * @returns {object} personal data extracted from the page 
 * */

const getPersonalData = (html)=>{
    const $ = cheerio.load(html)
    let personalData = {}
    
    $('.form-group').each((index, element)=>{
        const propertyKey = $(element).find('label').text()
        const propertyValue = $(element).find('p').text()

        personalData = {...personalData, [propertyKey]: propertyValue}
    })
    
    return personalData
}

//uses generator function to be able to capture data on intermediate states, should be able to 
//should be able to use async await since nightmare is promise based
function *scrapePage(){
    console.time("dbsave")
    let websiteData = []
    let websiteUserData = []
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
    

    let n = 255 //should start at -1 so we can get all the results since they start at page 0 to capture it when next is clicked
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

    //Get personal information from every link generated in the above while loop
   for(let i = 0; i< websiteData.length; i++){
        console.log(i)
        yield nightmare
        .goto(`https://roi.aib.gov.uk${websiteData[i]['Case Reference Number']}`)
        .wait('#ExternalLink_AiB')
        //add logic to extract information from page
        const body = yield nightmare.evaluate(()=>document.querySelector('body').innerHTML)
        personalData = getPersonalData(body)
        websiteUserData = [...websiteUserData, personalData]
   }

    yield nightmare.end()
    console.timeEnd("dbsave")
    return websiteUserData

} 