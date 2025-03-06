const puppeteer = require("puppeteer");

module.exports.scrapeLinkedInProfile = async (uid)=> {



  const url = `https://www.linkedin.com/in/${uid}`;

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {

    console.log("Navigating to LinkedIn Login Page...");
    await page.goto("https://www.linkedin.com/login");

    // Login
    await page.type('input[name="session_key"]', "sentobirl@gmail.com");
    await page.type('input[name="session_password"]', "divyjeet@129025");
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
    console.log("Logged in successfully!");

    await page.goto(url, { waitUntil: "networkidle2" });

    const name = await page.$eval(".text-heading-xlarge", el => el.innerText.trim());
    const headline = await page.$eval(".text-body-medium.break-words", el => el.innerText.trim());
    const location = await page.$eval(".text-body-small.inline.t-black--light.break-words", el => el.innerText.trim());

    const experience = await page.$$eval("#experience-section ul li", items =>
      items.map(item => ({
        title: item.querySelector("h3")?.innerText.trim() || "",
        company: item.querySelector("p.pv-entity__secondary-title")?.innerText.trim() || "",
        duration: item.querySelector(".pv-entity__date-range span:nth-child(2)")?.innerText.trim() || "",
      }))
    );

    const skills = await page.$$eval(".pvs-list__outer-container .pvs-list__paged-list-item span", items =>
      items.map(item => item.innerText.trim())
    );

    await browser.close();

    return { uid, name, headline, location, experience, skills };
  } catch (error) {
    console.error("Error scraping:", error);
    await browser.close();
    return null;
  }
}


