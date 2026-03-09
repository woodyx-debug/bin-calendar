import requests
from bs4 import BeautifulSoup

UPRN = "100030292869"

url = f"https://secure.derby.gov.uk/binday/{UPRN}"

r = requests.get(url)
soup = BeautifulSoup(r.text,"html.parser")

events = []

for row in soup.find_all("tr"):
    cols = row.find_all("td")
    if len(cols) >= 2:
        waste = cols[0].text.strip()
        date = cols[1].text.strip()

        try:
            d = date.split()
            day = d[0].zfill(2)
            month = d[1]
            year = d[2]
        except:
            continue

        events.append((waste,date))

ics = """BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//DerbyBins//EN
"""

for waste,date in events:

    from datetime import datetime
    dt = datetime.strptime(date,"%d %B %Y").strftime("%Y%m%d")

    ics += f"""
BEGIN:VEVENT
SUMMARY:{waste} Bin Collection
DTSTART;VALUE=DATE:{dt}
END:VEVENT
"""

ics += "END:VCALENDAR"

open("bins.ics","w").write(ics)
