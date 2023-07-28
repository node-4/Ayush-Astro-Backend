const notification = require('../models/Notification');
const User = require("../models/User");


exports.AddNotification = async (req, res) => {
    try {
        let Data 
        let findUser = await User.find();
        if (findUser.length > 0) {
            for (let i = 0; i < findUser.length; i++) {
                const data = {
                    user: findUser[i]._id,
                    message: req.body.message,
                }
                 Data = await notification.create(data);
            }
            res.status(200).json({ details: Data })
        }
    } catch (err) {
        console.log(err);
        res.status(400).json({
            message: err.message
        })
    }
}


exports.updateNotification = async (req, res) => {
    try {
        await notification.findByIdAndUpdate({ _id: req.params.id }, {
            message: req.body.message
        })
        res.status(200).json({
            message: "Updated "
        })
    } catch (err) {
        console.log(err);
        res.status(400).json({
            message: err.message
        })
    }
}


exports.getNotification = async (req, res) => {
    try {
        const data = await notification.find({ user: req.user });

        res.status(200).json({ message: data })
    } catch (err) {
        console.log(err);
        res.status(400).json({
            message: err.message
        })
    }
}

exports.deleteNotification = async (req, res) => {
    try {
        await notification.findByIdAndDelete({ _id: req.params.id })
        res.status(200).json({
            message: "Deleted  "
        })
    } catch (err) {
        console.log(err);
        res.status(400).json({
            message: err.message
        })
    }
}