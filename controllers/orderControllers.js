const order = require('../models/order');
const user = require('../models/User');
const astro = require('../models/astrologer')


exports.CreateOrder = async(req,res) => {
    try{
    const userId  = req.body.userId;
    const astroId  = req.body.astroId;
    const astroData = await astro.findById({_id: astroId});
    const userData = await user.findById({_id: userId});
    console.log(astroData)
    const data = {
        astroName: astroData.firstName,
        user: userId,
        astroId: req.body.astroId, 
        time: req.body.time, 
        name: userData.firstName + " " + userData.lastName,
        problem : req.body.problem, 
        language: userData.language, 
        rashi : userData.rashi
    }
  console.log(data)
  const orderData = await order.create(data);
  console.log(orderData);
  res.status(200).json({
    details: orderData
  })
}catch(err){
    console.log(err)
    res.status(400).json({message: err.message})
}

}


exports.GetAllOrder = async(req,res) => {
    try{
   const orderData = await order.find();
   res.status(200).json({
    details : orderData
   })
    }catch(err){
        console.log(err);
        res.status(400).json({
            message: err.message
        })
    }
}

exports.GetByOrderUserId = async(req,res) => {
    try{
  const data = await order.find({user:req.params.id})
  res.status(200).json({
    details : data
  })
    }catch(err){
        res.status(400).json({
            message: err.message
        })
    }
}

exports.GetVyID = async(req,res) => {
    try{
    const data = await order.findById({_id: req.params.id});
    res.status(200).json({
        details : data
    })
    }catch(err){
        res.status(400).json({
            message: err.message
        })
    }
}


exports.updateOrder = async(req,res) => {
    try{
    await order.findByIdAndUpdate({_id: req.params.id}, {
        time: req.body.time, 
        problem : req.body.problem, 
    });
    res.status(200).json({message: "Order Updated"})
    }catch(err)
    {
        res.status(400).json({message: err.message})
    }
}



exports.DeleteOrder  = async(req,res) => {
    try{
    await order.findByIdAndDelete({_id: req.params.id});
    res.status(200).json({message: "Deleted  Updated"})
    }catch(err)
    {
        res.status(400).json({message: err.message})
    }
}


exports.GetByAstroId = async(req,res) => {
    try{
    const data = await order.find({astroId: req.params.id}).sort({timestamp : -1})
    res.status(200).json({
        details : data
    })
    }catch(err){
        res.status(400).json({
            message: err.message
        })
    }
}
