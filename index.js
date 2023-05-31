const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const compression = require("compression");
const serverless = require("serverless-http");
const app = express();
const path = require("path");
app.use(compression({ threshold: 500 }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
require('./controllers/notificationCronjob')
if (process.env.NODE_ENV == "production") {
    console.log = function () { };
}
//console.log = function () {};
app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/auth", require("./routes/auth.route"));
app.use("/user", require("./routes/userRoutes"));
app.use('/astrologer',require("./routes/astrologer") );
app.use('/horoscope', require("./routes/horoScopeRoute"));
app.use('/kundli', require('./routes/kundliRourer'));
app.use('/order', require('./routes/order'));
app.use('/product', require('./routes/product'))
app.use('/astrocallhistory', require('./routes/astrocallRouter'));
app.use('/discount', require('./routes/discountRouter'));
app.use('/chat', require('./routes/chatHistory'))
app.use('/agora', require('./routes/agoreRouter.'))
app.use("/admin", require("./routes/admin"));
app.use("/banner", require("./routes/bannerRoutes"));
app.use("/notification", require("./routes/notificationRouter"));
app.use("/support", require("./routes/supportRoute"));
mongoose.Promise = global.Promise;
mongoose.set("strictQuery", true);

mongoose.connect(process.env.DB_URI, (err) => {
    if (!err) {
        console.log("MongoDB Connection Succeeded.");
    } else {
        console.log("Error in DB connection: " + err);
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}!`);
});

module.exports = { handler: serverless(app) }