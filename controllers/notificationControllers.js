const notification = require('../models/Notification');


exports.AddNotification = async(req,res) => {
    try{
        const data = {
            message: req.body.message, 
        }
    const Data = await notification.create(data);
    res.status(200).json({
        details : Data
    })
    }catch(err){
        console.log(err);
        res.status(400).json({
            message: err.message
        })
    }
}


exports.updateNotification  = async(req,res) => {
    try{
    await notification.findByIdAndUpdate({_id: req.params.id}, {
        message: req.body.message
    })
    res.status(200).json({
        message: "Updated "
    })
    }catch(err){
        console.log(err);
        res.status(400).json({
            message: err.message
        })
    }
}


exports.getNotification   = async(req,res) => {
    try{
  const data = await notification.find();

    res.status(200).json({
        message: data
    })
    }catch(err){
        console.log(err);
        res.status(400).json({
            message: err.message
        })
    }
}

exports.deleteNotification  = async(req,res) => {
    try{
    await notification.findByIdAndDelete({_id: req.params.id})
    res.status(200).json({
        message: "Deleted  "
    })
    }catch(err){
        console.log(err);
        res.status(400).json({
            message: err.message
        })
    }
}