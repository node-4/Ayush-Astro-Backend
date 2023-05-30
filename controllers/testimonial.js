const testimonal = require('../models/testmonial');


exports.AddTestimonial = async(req,res) => {
    try{
    const data = {
        image: req.body.image,
        Name: req.body.name, 
        desc: req.body.desc
    }
    const Data = await testimonal.create(data);
    res.status(200).json({
        message: Data 
    })
    }catch(err){
        res.status(400).json({
            message: err.message
        })
    }
}


exports.getTestimonial = async(req,res) => {
    try{
        const data = await testimonal.find();
        res.status(200).json({
            details: data
        })
    }catch(err){
        res.status(400).json({
            message: err.message
        })
    }
}


exports.deleteTestmoial = async(req,res) => {
    try{
   await testimonal.findByIdAndDelete({_id: req.params.id});
   res.status(200).json({
    message :" Deleted "
   })
    }catch(err){
        res.status(400).json({
            message: err.message
        })
    }
}