const Wallet = require("../models/wallet");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/User");
const transaction = require("../models/transaction");
const astrologer = require('../models/astrologer');

exports.addMoney = catchAsync(async (req, res) => {
    const wallet = await Wallet.findOne({ user: req.body.user });
    console.log(wallet);
    if (!wallet) {
        const w = await Wallet.create({ user: req.body.user, balance: req.body.balance });
        return res.status(200).json({ status: "success", data: w, });
    }
    wallet.balance = wallet.balance + req.body.balance;
    const w = await wallet.save();
    return res.status(200).json({
        status: "success",
        data: w,
    });
});

exports.removeMoney = catchAsync(async (req, res) => {
    const wallet = await Wallet.findOne({ user: req.body.user });
    if (!wallet) {
        return res.status(200).json({ status: "success", data: {} });
    }
    wallet.balance = wallet.balance - req.body.balance;
    const w = await wallet.save();

    return res.status(200).json({
        status: "success",
        data: w,
    });
});

exports.getWallet = catchAsync(async (req, res) => {
    console.log(req.user);
    const wallet = await Wallet.findOne({ user: req.user });
    return res.status(200).json({
        status: "success",
        data: wallet,
    });
});

// ADMIN

exports.getWalletById = catchAsync(async (req, res) => {
    const w = await Wallet.findOne({ _id: req.params.id });

    return res.status(200).json({
        status: "success",
        data: w,
    });
});

exports.createWallet = catchAsync(async (req, res) => {
    const getDetails = await User.findById(req.body.userId);
    if (!getDetails) {
        return res.status(404).json({ message: "Enter the correct id", status: 404 });
    } else {
        const wallet = await Wallet.findOne({ user: req.body.userId });
        if (wallet) {
            return res.status(409).json({ message: "This user id wallet already exit", status: 409 });
        }
        const w = await Wallet.create({ user: req.body.userId });
        return res.status(200).json({ status: "success", data: w, });
    }
});
exports.createTransation = catchAsync(async (req, res) => {
    try {
        if (req.body.user != (null || undefined)) {
            const getDetails = await User.findById(req.body.user);
            if (!getDetails) {
                return res.status(404).json({ message: "Enter the correct id", status: 404 });
            }
        }
        if (req.body.astrologer != (null || undefined)) {
            const getDetails1 = await astrologer.findById(req.body.astrologer);
            if (!getDetails1) {
                return res.status(404).json({ message: "Enter the correct id", status: 404 });
            }
        }
        let date = new Date(Date.now()).getDate();
        let month = new Date(Date.now()).getMonth() + 1;
        let year = new Date(Date.now()).getFullYear();
        let month1, date1;
        if (month < 10) { month1 = '' + 0 + month; } else { month1 = month }
        if (date < 10) { date1 = '' + 0 + date; } else { date1 = date }
        let fullDate = (`${year}-${month1}-${date1}`);
        if ((req.body.user != (null || undefined)) && (req.body.astrologer != (null || undefined))) {
            let obj = {
                user: req.body.user,
                astrologer: req.body.astrologer,
                date: fullDate,
                amount: req.body.amount,
                month: month1,
                paymentMode: req.body.paymentMode,
                type: "Debit",
                Status: req.body.Status,
            }
            await transaction.create(obj);
            let obj1 = {
                user: req.body.user,
                astrologer: req.body.astrologer,
                date: fullDate,
                amount: req.body.amount,
                month: month1,
                paymentMode: req.body.paymentMode,
                type: "Credit",
                Status: req.body.Status,
            }
            await transaction.create(obj1);
        }
        if ((req.body.user != (null || undefined)) && (req.body.astrologer == (null || undefined))) {
            let obj = {
                user: req.body.user,
                date: fullDate,
                amount: req.body.amount,
                month: month1,
                paymentMode: req.body.paymentMode,
                type: "Credit",
                Status: req.body.Status,
            }
            await transaction.create(obj);
        }
        if ((req.body.user == (null || undefined)) && (req.body.astrologer != (null || undefined))) {
            let obj1 = {
                astrologer: req.body.astrologer,
                date: fullDate,
                amount: req.body.amount,
                month: month1,
                paymentMode: req.body.paymentMode,
                type: "Debit",
                Status: req.body.Status,
            }
            await transaction.create(obj1);
        }
        return res.status(200).json({ message: "Transation create successfully.", status: 200 });
    } catch (error) {
        return res.status(501).json({ message: "internal server error", status: 501 });

    }

});
exports.listTransation = catchAsync(async (req, res) => {
    try {
        if (req.body.user != (null || undefined)) {
            const getDetails = await User.findById(req.body.user);
            if (!getDetails) {
                return res.status(404).json({ message: "Enter the correct id", status: 404 });
            }
        }
        if (req.body.astrologer != (null || undefined)) {
            const getDetails1 = await astrologer.findById(req.body.astrologer);
            if (!getDetails1) {
                return res.status(404).json({ message: "Enter the correct id", status: 404 });
            }
        }
        const findTransation = await transaction.find({ $or: [{ user: req.body.user }, { astrologer: req.body.astrologer }] });
        if (findTransation.length > 0) {
            return res.status(200).json({ message: "Transaction found successfully.", status: 200, data: findTransation });
        } else {
            return res.status(404).json({ message: "Transaction not found", status: 404 });
        }
    } catch (error) {
        return res.status(501).json({ message: "internal server error", status: 501 });

    }

});
exports.getTransationById = catchAsync(async (req, res) => {
    try {
        const findTransation = await transaction.findOne({ _id: req.params.id });
        if (findTransation) {
            return res.status(200).json({ message: "Transaction found successfully.", status: 200, data: findTransation });
        } else {
            return res.status(404).json({ message: "Transaction not found", status: 404 });
        }

    } catch (error) {
        return res.status(501).json({ message: "internal server error", status: 501 });
    }
});