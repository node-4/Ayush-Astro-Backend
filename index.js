const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const globalErrorHandler = require("./controllers/errorController");
require("dotenv").config();
const path = require("path");
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use(cookieParser());
app.use(cors());

const PORT = process.env.PORT || 3002;
const DB_URI = process.env.DB_URI;

app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.use("/api/v1/", require("./routes/router"));
app.use(globalErrorHandler);

const Main = async () => {
    try {
        mongoose.Promise = global.Promise;
        mongoose.set("strictQuery", true);

        mongoose.connect(DB_URI, (err) => {
            if (!err) {
                console.log("MongoDB Connection Succeeded.");
            } else {
                console.log("Error in DB connection: " + err);
            }
        });

        app.listen(PORT, async () => {
            console.log(`server started ON ${PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
};

// //file upload

// const multer = require('multer');

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, '/public/uploads');
//   },

//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//     cb(null, file.fieldname + '-' + uniqueSuffix)
//   }
// });
// const upload1 = multer({ storage: storage }).single("user_file");
// app.post("/upload", (req, res) => {
//   console.log(req.data)
//   upload1(req, res, (err) => {
//     if (err) {
//       res.status(400).send("Something went wrong!");
//     }
//     res.send(req.file);
//   });
// });

Main();
