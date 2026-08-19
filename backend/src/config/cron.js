import { CronJob } from 'cron'; 
import https from 'https';

const job = new CronJob("*/14 * * * *", function () {
    if (!process.env.API_URL) {
        console.log("Skipping Keep-Alive: API_URL not set");
        return;
    }

    https.get(process.env.API_URL, (res) => {
        if (res.statusCode === 200) console.log("GET request sent successfully");
        else console.log("GET request failed", res.statusCode);
    })
    .on("error", (e) => console.error("Error while sending request", e));

});

job.start();

export default job;