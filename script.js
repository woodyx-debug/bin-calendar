import fs from "fs";
import fetch from "node-fetch";
import cheerio from "cheerio";

const POSTCODE = "DE224AF";
const PROPERTY_ID = "100030292869"; // replace with your property ID

async function getBinPage() {

 const url = `https://secure.derby.gov.uk/binday/${PROPERTY_ID}`;

 const res = await fetch(url);
 const html = await res.text();

 return html;
}

function extractDates(html){

 const $ = cheerio.load(html);

 const events = [];

 $("table tr").each((i,row)=>{

  const cols = $(row).find("td");

  if(cols.length >= 2){

   const type = $(cols[0]).text().trim();
   const date = $(cols[1]).text().trim();

   if(type && date){

    const parsed = new Date(date);

    const y = parsed.getFullYear();
    const m = String(parsed.getMonth()+1).padStart(2,"0");
    const d = String(parsed.getDate()).padStart(2,"0");

    events.push({
     type,
     date:`${y}${m}${d}`
    });

   }
  }

 });

 return events;

}

function createICS(events){

 let ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Derby Bins//EN
`;

 events.forEach(e=>{

  ics += `
BEGIN:VEVENT
SUMMARY:${e.type} Bin Collection
DTSTART;VALUE=DATE:${e.date}
END:VEVENT
`;

 });

 ics += "END:VCALENDAR";

 return ics;

}

async function run(){

 const html = await getBinPage();

 const events = extractDates(html);

 const ics = createICS(events);

 fs.writeFileSync("bins.ics",ics);

 console.log("bins.ics created");

}

run();
