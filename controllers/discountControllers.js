const discount = require('../models/discount');


exports.Adddiscount = async(req,res) => {
    try{
   const data = {
        code: req.body.code,
        activeDate: req.body.activeDate, 
        expireDate: req.body.expireDate, 
        percent: req.body.percent, 
   }
   const Data = await discount.create(data);
   res.status(200).json({
    message: Data
   })
    }catch(err){
        res.status(400).json({
            message: err.message
        })
    }
}


exports.UpdateDiscount  = async(req,res) => {
    try{
   await discount.findByIdAndUpdate({_id: req.params.id}, {
        code: req.body.code,
        activeDate: req.body.activeDate, 
        expireDate: req.body.expireDate, 
        percent: req.body.percent
   });
   res.status(200).json({
    message: "Data is Updated "
   })
    }catch(err){
        res.status(400).json({
            message: err.message
        })
    }
}


exports.GetAllDiscount = async(req,res) => {
    try{
 const data = await discount.find();

 res.status(200).json({
    message: data
 })
    }catch(err){
  res.status(400).json({
    message: err.message
  })
    }
}


exports.GetAllById = async(req,res) => {
    try{
 
 const data = await discount.findById({_id: req.params.id});
 console.log(data);
 res.status(200).json({
    message: data
 })
    }catch(err){
  res.status(400).json({
    message: err.message
  })
    }
}

exports.DeleteDiscount = async(req,res) => {
    try{
  await discount.findByIdAndDelete({_id: req.params.id});
 res.status(200).json({
    message: "Message Deleted "
 })
    }catch(err){
  res.status(400).json({
    message: err.message
  })
    }
}