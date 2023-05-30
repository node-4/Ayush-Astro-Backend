const feedback = require('../models/astrofeedback');



exports.AddFeedback = async(req,res) => {
    try{
    const {astroId , Feedback , rating} = req.body;
    if(!astroId && Feedback && rating){
        return res.status(201).send({message: "All filds are required"})
    }else{
        const data = await feedback.create({astroId, Feedback, rating});
        res.status(200).json({
            details: data 
        })
    }
    }catch(err){
        console.log(err);
        res.status(400).json({
            message: err.message
        })
    }
}


exports.getAllfeedback = async(req,res) => {
    try{
        const data = await feedback.find();
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


exports.getById = async(req,res) => {
    try{
     const data = await feedback.findOne({_id: req.body.id});
     res.status(200).json({details : data});
    }catch(err){
        console.log(err);
        res.status(400).json({message: err.message})
    }
}


exports.DeleteAstro = async(req,res) => {
    try{
 await feedback.findByIdAndDelete({_id: req.body.id})
    }catch(err){
        console.log(err)
        res.status(400).json({
            message: "Deleted "
        })
    }
}