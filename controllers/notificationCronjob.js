const cronJob = require("cron").CronJob;
let Notification = require("../models/Notification");
let wallet = require("../models/wallet");
let userModel = require("../models/User");
// new cronJob('0 */2 * * *', async function () {
new cronJob("0 0 * * *", async function () {
    let users = await userModel.find({});
    if (users.length > 0) {
        for (let i = 0; i < users.length; i++) {
            let findWallet = await wallet.findOne({ user: users[i]._id });
            if (findWallet) {
                if (findWallet.balance < 51) {
                    let obj = {
                        user: users[i]._id,
                        message:
                            "Add amount in your wallet, your wallet balance is less than minimum balance.",
                    };
                    const Data = await Notification.create(obj);
                }
            } else {
                let obj = {
                    user: users[i]._id,
                    message: "Create and add amount in your wallet.",
                };
                const Data = await Notification.create(obj);
            }
        }
    } else {
        console.log("no user found.");
    }
}).start();
// }).stop()
