const cronJob = require("cron").CronJob;
let Notification = require("../models/Notification");
let wallet = require("../models/wallet");
// new cronJob('0 */2 * * *', async function () {
new cronJob("*/5 * * * *", async function () {
    let obj = {
        user: "",
        message: "",
    };
}).start();
// }).stop()
