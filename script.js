import fs from "fs";

const collections = [
 {date:"2026-03-12", type:"Recycling"},
 {date:"2026-03-19", type:"General"}
];

let ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Bin Calendar//EN
`;

collections.forEach(c => {
 const date = c.date.replaceAll("-","");
 ics += `
BEGIN:VEVENT
SUMMARY:${c.type} Bin Collection
DTSTART;VALUE=DATE:${date}
END:VEVENT
`;
});

ics += "END:VCALENDAR";

fs.writeFileSync("bins.ics", ics);
