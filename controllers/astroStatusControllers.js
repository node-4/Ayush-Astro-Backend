
const astro_Model = require('../models/astroStatus');
const astro = require('../models/astrologer');



exports.AddStatus = async(req,res) => {
    try{
const astroData = await astro.findById({_id : req.body.astroId});
if(!astroData){
    return res.status(401).json({
        message: "No UserId is Wrong "
    })
}else{

console.log(astroData);
const data = {
    astroId: req.body.astroId, 
    name: astroData.firstName +" " + astroData.lastName, 
    time: req.body.time, 
    status: req.body.status
}
const Data = await astro_Model.create(data);
res.status(200).json({
    message: "History is Added ", 
    details : Data
})
}
    }catch(err){
        console.log(err);
        res.status(400).json({
            message: err.message
        })
    }
}

exports.getStatus = async(req,res ) => {
    try{
        const data = await astro_Model.find({astroId: req.params.id});
        if(!data){
            return res.status(401).json({
                message: "No Call- history for this USer  "
            })
        }else{
            res.status(200).json({
                details: data
            })
        }
    }catch(err){
        res.status(400).json({
            message: err.message
        })
    }
}

