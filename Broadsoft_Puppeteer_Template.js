// Broadsoft PBX credentials - TODO: Separate to cred file and import.

const CREDS = {
    user: 'userAdmin',
    pass: '******'
}

// User ID of users to target - TODO: Separate to USERS targets file

const USERS =[
    
]

// DIDs to target - TODO: Separate to DIDS targets file

const DIDS = [
    5555555555,
    5559999999,
    5558529633,
]

const puppeteer = require('puppeteer');
async function main(users) {
const browser = await puppeteer.launch({headless: true});
const page = await browser.newPage();
await page.setViewport({width: 1200, height: 720})

//Go to Cisco Broadsoft login - TODO: Extract to its own variable. Separate file.
await page.goto('https://pbx.server/Login/', { waitUntil: 'networkidle0' }); 
// wait until page load
await page.type("input[name='EnteredUserID']", CREDS.user);
await page.type("input[name='Password']", CREDS.pass);
// click and wait for navigation
await Promise.all([
          page.click('.logintext3 a'),
          page.waitForNavigation({ waitUntil: 'networkidle0' }),
]);
// Search by users
await Promise.all([
    page.click('a[name="/Operator/Users/"]'),
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
]);

// Iterate over DID array - TODO add error catch
for (i = 0; i < DIDS.length; i++) {
    console.log('Removing DID ' + DIDS[i])
    await page.select('#findKey0', 'Dn');
    await page.type("#findValue0", String(DIDS[i]));
    
    await Promise.all([
        page.click('#search0'),
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);
    await Promise.all([
        page.click('#Row1Col0'),
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);
    await Promise.all([
        page.click('a[name="/User/Addresses/"]'),
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);
    
    await Promise.all([
        page.select('#phoneNumber', ''),
        page.click('input[name="apply"]'),
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);
    await Promise.all([
        page.click('input[name="apply"]'),
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);
    
    await page.goto('https://pbx.server/Operator/Users/', { waitUntil: 'networkidle0' });
  }
console.log('Completed')  
browser.close()
}


main();