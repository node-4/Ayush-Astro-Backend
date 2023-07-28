const Wallet = require("../models/wallet");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/User");

exports.addMoney = catchAsync(async (req, res) => {
    const wallet = await Wallet.findOne({ user: req.body.user });
    console.log(wallet);
    wallet.balance = wallet.balance + req.body.balance;
    const w = await wallet.save();

    res.status(200).json({
        status: "success",
        data: w,
    });
});

exports.removeMoney = catchAsync(async (req, res) => {
    const wallet = await Wallet.findOne({ user: req.body.user });

    wallet.balance = wallet.balance - req.body.balance;
    const w = await wallet.save();

    res.status(200).json({
        status: "success",
        data: w,
    });
});

exports.getWallet = catchAsync(async (req, res) => {
    console.log(req.user);
    const wallet = await Wallet.findOne({ user: req.user });
    res.status(200).json({
        status: "success",
        data: wallet,
    });
});

// ADMIN

exports.getWalletById = catchAsync(async (req, res) => {
    const w = await Wallet.findOne({ _id: req.params.id });

    res.status(200).json({
        status: "success",
        data: w,
    });
});

exports.createWallet = catchAsync(async (req, res) => {
    const getDetails = await User.findById(req.body.userId);
    if (!getDetails) {
        res.status(404).json({ message: "Enter the correct id", status: 404 });
    } else {
        const wallet = await Wallet.findOne({ user: req.body.userId });
        if (wallet) {
            res.status(409).json({ message: "This user id wallet already exit", status: 409 });
        }
        const w = await Wallet.create({ user: req.body.userId });
        res.status(200).json({ status: "success", data: w, });
    }
});
