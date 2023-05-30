
const express = require('express');
const {RtcTokenBuilder, RtcRole} = require('agora-access-token');
const dotenv = require('dotenv');
const APP_ID = process.env.APP_ID;
const APP_CERTIFICATE = process.env.APP_CERTIFICATE
const { v4: uuidv4 } = require('uuid');
const astro = require('../models/astrologer');
const user = require('../models/User');
const Astrostatus = require('../models/astroStatus');
const order = require('../models/order');
const userStatus = require('../models/userStatus')
const router = express();


exports.nocache = (req,res, next) => {
    res.header('Cache-Control, private, no-cache, no-store, mush-revalidate' )
    res.header('Expire', '-1');
    res.header('Pragma', 'nocache');
    next();
}


exports.generateAccessTokenUser = async(req,res) => {
    try{
    res.header('Acess-Control-Allow-Origin', "*");
    const astroData = await order.findById({_id: req.params.id});

    const channelName = astroData.astroName
    const uuid = uuidv4(); 
    let role = RtcRole.PUBLISHER;
    let expiresTime = req.body.expiresTime;
    if(!expiresTime || expiresTime == ''){
        expiresTime =  36000
    }else{
        expiresTime  = parseInt(expiresTime, 10)
    }

    const currentTime = Math.floor(Date.now()/ 1000);
    const priviligeExpireTime = currentTime + expiresTime;
    const token = RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, channelName, uuid, role, priviligeExpireTime);
    const data = {
        astroId: astroData.astroId, 
        userId: astroData.user, 
        channelName: channelName,
        status: req.body.status,
        token: token

    }
    const  Data  = await userStatus.create(data)
    return res.status(200).json({
        token : Data
    })
    }catch(err){
        console.log(err)
    }
}



exports.generateAccessToken = async(req,res) => {
    try{
    res.header('Acess-Control-Allow-Origin', "*");
    const astroData = await astro.findById({_id: req.body.astroId});
    console.log(astroData);
    const channelName = astroData.firstName +
     astroData.mobile;
    const uuid = uuidv4(); 
    let role = RtcRole.SUBSCRIBER;
    if(req.body.role == "publisher"){
        role = RtcRole.PUBLISHER
    }

    let expiresTime = req.body.expiresTime;
    if(!expiresTime || expiresTime == ''){
        expiresTime =  36000
    }else{
        expiresTime  = parseInt(expiresTime, 10)
    }

    const currentTime = Math.floor(Date.now()/ 1000);
    const priviligeExpireTime = currentTime + expiresTime;
    const token = RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, channelName, uuid, role, priviligeExpireTime);
    const data = {
        astroName: astroData.firstName + astroData.lastName,
        astroId: req.body.astroId, 
        userId: req.body.userId, 
        channelName: channelName,
        status: req.body.status, 
        token : token 
    }
    const  Data  = await Astrostatus.create(data)
    return res.status(200).json({
        token : Data
    })
    }catch(err){
        console.log(err)
    }
}