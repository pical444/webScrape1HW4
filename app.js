const https = require('https');
const JSSoup = require('jssoup').default;
const fs = require('fs');
const url = "https://en.wikipedia.org/wiki/2001:_A_Space_Odyssey_(film)"; // FIRST: find a url of a page you are interested in from wikipedia 
const jsonPath = "./json/"; 
const name = "movieMovie";


/*
This web-scraping example is set up for working with wikipedia.If you want to adapt this
to scrape another site you should go and inspect the site in the browser first, then adapt this. 
*/

//returns one large string of all text
function getParagraphText(soupTag){
    let paragraphs = soupTag.findAll('p');
    let text = "";
    for(let i = 0; i < paragraphs.length; i++){
        let p = paragraphs[i].getText().toLowerCase();

        // if(p.indexOf("directed") != -1){
            console.log(p);
        text += p;
        // }
    }

    return text;
}

//pass in Plain Old Javascript Object that's formatted as JSON
function writeJSON(data){
    try {
        let path = jsonPath+name+".json";
        fs.writeFileSync(path, JSON.stringify(data, null, 2), "utf8");
        console.log("JSON file successfully saved");
    } catch (error) {
        console.log("An error has occurred ", error);
    }
}

//create soup  
function createSoup(document){
    
    let soup = new JSSoup(document);

    let main = soup.find('main');//only get the content from the main body of the page
    let bodyContent = soup.find('div',{id:"bodyContent"});
   
    let data = {
        "name": name,
        "url": url,
        "text": getParagraphText(bodyContent)
    }
    // console.log(bodyContent);
   
    // console.log(getParagraphText(bodyContent));

    writeJSON(data);

}

//Request the url
https.get(url, (res) => {
    console.log('statusCode:', res.statusCode);
    //  console.log('headers:', res.headers);
    
    let document = [];

    res.on('data', (chunk) => {
        document.push(chunk);
    }).on('end', () => {
        document = Buffer.concat(document).toString();
        // console.log(document);
        
        // create soup
         createSoup(document);
    });

}).on('error', (e) => {
    console.error(e);
});

