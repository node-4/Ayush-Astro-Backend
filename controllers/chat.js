const chatModel = require('../models/chatModel');;
const userModel = require('../models/User');
const astrologer = require('../models/astrologer');
exports.userChat = async (req, res) => {
    try {
        let userData = await userModel.findOne({ $and: [{ $or: [{ _id: req.body.senderId }, { _id: req.body.reciverId }] }] });
        if (!userData) {
            return res.status(404).json({ status: 404, message: "User not found.", data: {} });
        } else {
            let astroData = await astrologer.findOne({ $and: [{ $or: [{ _id: req.body.senderId }, { _id: req.body.reciverId }] }] });
            if (!astroData) {
                return res.status(404).json({ status: 404, message: "Data not found.", data: {} });
            } else {
                let userName, messageStatus1, messageStatus2;
                if (req.body.senderId == (userData._id).toString()) {
                    userName = `${userData.firstName} ${userData.lastName}`
                    messageStatus1 = "Read"
                    messageStatus2 = "Unread"
                }
                if (req.body.senderId == (astroData._id).toString()) {
                    userName = `${astroData.firstName} ${astroData.lastName}`
                    messageStatus1 = "Unread"
                    messageStatus2 = "Read"
                }
                let chatData = await chatModel.findOne({ $and: [{ userId: userData._id }, { astroId: astroData._id }] });
                if (chatData) {
                    let messageDetail;
                    if (req.body.Type == "AUDIO") {
                        messageDetail = {
                            sender: req.body.senderId,
                            userName: userName,
                            Type: req.body.Type,
                            audio: req.body.audio,
                            message: req.body.message,
                            time: Date.now(),
                            messageStatus1: messageStatus1,
                            messageStatus2: messageStatus2
                        }
                    } else if (req.body.Type == "VIDEO") {
                        messageDetail = {
                            sender: req.body.senderId,
                            userName: userName,
                            Type: req.body.Type,
                            video: req.body.video,
                            message: req.body.message,
                            time: Date.now(),
                            messageStatus1: messageStatus1,
                            messageStatus2: messageStatus2
                        }
                    } else if (req.body.Type == "DOCS") {
                        let docs = req.files['docs'];
                        req.body.docs = docs[0].path;
                        messageDetail = {
                            sender: req.body.senderId,
                            userName: userName,
                            Type: req.body.Type,
                            message: req.body.message,
                            docs: req.body.docs,
                            time: Date.now(),
                            messageStatus1: messageStatus1,
                            messageStatus2: messageStatus2
                        }
                    } else if (req.body.Type == "IMAGES") {
                        let image = req.files['image'];
                        req.body.image = image[0].path;
                        messageDetail = {
                            sender: req.body.senderId,
                            userName: userName,
                            Type: req.body.Type,
                            message: req.body.message,
                            image: req.body.image,
                            time: Date.now(),
                            messageStatus1: messageStatus1,
                            messageStatus2: messageStatus2
                        }
                    } else {
                        messageDetail = {
                            sender: req.body.senderId,
                            userName: userName,
                            Type: req.body.Type,
                            message: req.body.message,
                            time: Date.now(),
                            messageStatus1: messageStatus1,
                            messageStatus2: messageStatus2
                        }
                    }
                    let saveChat = await chatModel.findByIdAndUpdate({ _id: chatData._id }, { $push: { messageDetail: messageDetail }, $set: { userName1: `${userData.firstName} ${userData.lastName}`, userName2: `${astroData.firstName} ${astroData.lastName}`, } }, { new: true })
                    if (saveChat) {
                        return res.status(200).json({ status: 200, message: "Message send successfully", data: saveChat });
                    }
                } else {
                    let messageDetail;
                    if (req.body.Type == "AUDIO") {
                        messageDetail = {
                            sender: req.body.senderId,
                            userName: userName,
                            Type: req.body.Type,
                            audio: req.body.audio,
                            message: req.body.message,
                            time: Date.now(),
                            messageStatus1: messageStatus1,
                            messageStatus2: messageStatus2
                        }
                    } else if (req.body.Type == "VIDEO") {
                        messageDetail = {
                            sender: req.body.senderId,
                            userName: userName,
                            Type: req.body.Type,
                            message: req.body.message,
                            video: req.body.video,
                            time: Date.now(),
                            messageStatus1: messageStatus1,
                            messageStatus2: messageStatus2
                        }
                    } else if (req.body.Type == "DOCS") {
                        let docs = req.files['docs'];
                        req.body.docs = docs[0].path;
                        messageDetail = {
                            sender: req.body.senderId,
                            userName: userName,
                            Type: req.body.Type,
                            message: req.body.message,
                            docs: req.body.docs,
                            time: Date.now(),
                            messageStatus1: messageStatus1,
                            messageStatus2: messageStatus2
                        }
                    } else if (req.body.Type == "IMAGES") {
                        let image = req.files['image'];
                        req.body.image = image[0].path;
                        messageDetail = {
                            sender: req.body.senderId,
                            userName: userName,
                            Type: req.body.Type,
                            image: req.body.image,
                            message: req.body.message,
                            time: Date.now(),
                            messageStatus1: messageStatus1,
                            messageStatus2: messageStatus2
                        }
                    } else {
                        messageDetail = {
                            sender: req.body.senderId,
                            userName: userName,
                            Type: req.body.Type,
                            message: req.body.message,
                            time: Date.now(),
                            messageStatus1: messageStatus1,
                            messageStatus2: messageStatus2
                        }
                    }
                    let obj = {
                        userId: userData._id,
                        astroId: astroData._id,
                        userName1: `${userData.firstName} ${userData.lastName}`,
                        userName2: `${astroData.firstName} ${astroData.lastName}`,
                        messageDetail: messageDetail,
                    }
                    let saveChat = await chatModel.create(obj);
                    if (saveChat) {
                        return res.status(200).json({ status: 200, message: "Message send successfully", data: saveChat });
                    }
                }
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: 'Internal server error' });
    }
};
exports.viewChat = async (req, res) => {
    try {
        let userData = await userModel.findOne({ _id: req.body.userId });
        if (!userData) {
            return res.status(404).json({ status: 404, message: "User not found.", data: {} });
        }
        let astroData = await astrologer.findOne({ _id: req.body.userId });
        if (!astroData) {
            return res.status(404).json({ status: 404, message: "Data not found.", data: {} });
        }
        if (astroData != (null || undefined) && userData == (null || undefined)) {
            let newMessages = []
            return new Promise(async (resolve, reject) => {
                let view = await chatModel.findOne({ _id: req.query._id }).populate("userId astroId", "firstName lastName").sort({ "messageDetail.time": -1 })
                if (!view) {
                    return res.status(404).json({ status: 404, message: "Data not found.", data: {} });
                } else {
                    view.messageDetail.map(o => {
                        if ((view.astroId._id).toString() == astroData._id) {
                            o.messageStatus1 = "Unread";
                            o.messageStatus2 = "Read";
                        }
                        newMessages.push(o)
                    })
                    let update = await chatModel.findOneAndUpdate({ _id: view._id }, { $set: { messageDetail: newMessages } }, { new: true });
                    if (update) {
                        let chat = await chatModel.findOne(update._id).populate("userId astroId", "firstName lastName").sort({ "messages.time": -1 })
                        return res.status(200).json({ status: 200, message: "Data found successfully.", data: chat });
                    }
                }
            })
        }
        if (astroData == (null || undefined) && userData != (null || undefined)) {
            let newMessages = []
            return new Promise(async (resolve, reject) => {
                let view = await chatModel.findOne({ _id: req.query._id }).populate("userId astroId", "firstName lastName").sort({ "messageDetail.time": -1 })
                if (!view) {
                    return res.status(404).json({ status: 404, message: "Data not found.", data: {} });
                } else {
                    view.messageDetail.map(o => {
                        if ((view.userId._id).toString() == userData._id) {
                            o.messageStatus1 = "Read";
                            o.messageStatus2 = "Unread";
                        }
                        newMessages.push(o)
                    })
                    let update = await chatModel.findOneAndUpdate({ _id: view._id }, { $set: { messageDetail: newMessages } }, { new: true });
                    if (update) {
                        let chat = await chatModel.findOne(update._id).populate("userId astroId", "firstName lastName").sort({ "messages.time": -1 })
                        return res.status(200).json({ status: 200, message: "Data found successfully.", data: chat });
                    }
                }
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 500, message: 'Internal server error' });
    }
};
exports.chattingHistory = async (req, res) => {
    try {
        let userData = await userModel.findOne({ _id: req.body.userId });
        if (!userData) {
            return res.status(404).json({ status: 404, message: "User not found.", data: {} });
        }
        let astroData = await astrologer.findOne({ _id: req.body.userId });
        if (!astroData) {
            return res.status(404).json({ status: 404, message: "Data not found.", data: {} });
        }
        if (astroData != (null || undefined) && userData == (null || undefined)) {
            let query = {};
            if (req.query.userName != (null || undefined)) {
                query.$or = [{ userName1: req.query.userName, astroId: astroData._id, deleteChat2: false }]
            } else {
                query.$or = [{ astroId: astroData._id, deleteChat2: false }]
            }
            let unRead = [];
            let result = await chatModel.find(query).sort({ "messages.createdAt": -1 }).populate("userId astroId", "firstName lastName");
            if (result.length == 0) {
                return res.status(200).json({ status: 200, message: "Data found successfully.", data: [] });
            }
            else {
                result.map(o => {
                    let count = o.messageDetail.filter(obj => obj.messageStatus2 == "Unread" && ((o.astroId._id).toString() == astroData._id)).length
                    let ob = {
                        status: o.status,
                        _id: o._id,
                        userId: o.userId,
                        astroId: o.astroId,
                        messageDetail: o.messageDetail,
                        totalUnreadMsg: count,
                        createdAt: o.createdAt,
                        updatedAt: o.updatedAt,
                        __v: o.__v
                    }
                    unRead.push(ob)
                })
                return res.status(200).json({ status: 200, message: "Data found successfully.", data: unRead });
            }
        }
        if (astroData == (null || undefined) && userData != (null || undefined)) {
            let query = {};
            if (req.query.userName != (null || undefined)) {
                query.$or = [{ userName2: req.query.userName, userId: userData._id, deleteChat1: false }]
            } else {
                query.$or = [{ userId: userData._id, deleteChat1: false }]
            }
            let unRead = [];
            let result = await chatModel.find(query).sort({ "messages.createdAt": -1 }).populate("userId astroId", "firstName lastName");
            if (result.length == 0) {
                return res.status(200).json({ status: 200, message: "Data found successfully.", data: [] });
            }
            else {
                result.map(o => {
                    let count1 = o.messageDetail.filter(obj => obj.messageStatus1 == "Unread" && ((o.userId._id).toString() == userData._id)).length
                    let ob = {
                        status: o.status,
                        _id: o._id,
                        userId: o.userId,
                        astroId: o.astroId,
                        messageDetail: o.messageDetail,
                        totalUnreadMsg: count1,
                        createdAt: o.createdAt,
                        updatedAt: o.updatedAt,
                        __v: o.__v
                    }
                    unRead.push(ob)
                })
                return res.status(200).json({ status: 200, message: "Data found successfully.", data: unRead });
            }
        }
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Internal server error' });
    }
};
exports.deleteChat = async (req, res) => {
    try {
        let userData = await userModel.findOne({ _id: req.body.userId });
        if (!userData) {
            return res.status(404).json({ status: 404, message: "User not found.", data: {} });
        }
        let astroData = await astrologer.findOne({ _id: req.body.userId });
        if (!astroData) {
            return res.status(404).json({ status: 404, message: "Data not found.", data: {} });
        }
        if (astroData != (null || undefined) && userData == (null || undefined)) {
            let view = await chatModel.findOne({ _id: req.query._id });
            if (!view) {
                return res.status(404).json({ status: 404, message: "Data not found.", data: {} });
            } else {
                let deleteChat1, deleteChat2;
                if ((astroData._id).toString() == (view.astroId).toString()) {
                    deleteChat2 = true
                    deleteChat1 = view.deleteChat1
                }
                if ((deleteChat1 == true) && (deleteChat2 == true)) {
                    let chatRes = await chatModel.findByIdAndDelete({ _id: view._id });
                    if (chatRes) {
                        response(res, SuccessCode.SUCCESS, view, SuccessMessage.DELETE_SUCCESS);
                    }
                }
                if ((deleteChat1 == true) && (deleteChat2 == false)) {
                    let messageDetail = [];
                    view.messageDetail.map(o => {
                        let messageClear1, messageClear2;
                        if ((astroData._id).toString() == (view.astroId).toString()) {
                            messageClear1 = o.messageClear1
                            messageClear2 = true
                        }
                        let obj = {
                            messageClear1: messageClear1,
                            messageClear2: messageClear2,
                            sender: o.sender,
                            userName: o.userName,
                            Type: o.Type,
                            message: o.message,
                            time: o.time,
                            messageStatus: o.messageStatus,
                            _id: o._id
                        }
                        messageDetail.push(obj)
                    });
                    let update = await chatModel.findByIdAndUpdate({ _id: view._id }, { $set: { messageDetail: messageDetail, deleteChat1: deleteChat1, deleteChat2: deleteChat2 } }, { new: true });
                    if (update) {
                        return res.status(200).json({ status: 200, message: "Data found successfully.", data: update });
                    }
                }
                if ((deleteChat1 == false) && (deleteChat2 == true)) {
                    let messageDetail = [];
                    view.messageDetail.map(o => {
                        let messageClear1, messageClear2;
                        if ((astroData._id).toString() == (view.astroId).toString()) {
                            messageClear1 = o.messageClear1
                            messageClear2 = true
                        }
                        let obj = {
                            messageClear1: messageClear1,
                            messageClear2: messageClear2,
                            sender: o.sender,
                            userName: o.userName,
                            Type: o.Type,
                            message: o.message,
                            time: o.time,
                            messageStatus: o.messageStatus,
                            _id: o._id
                        }
                        messageDetail.push(obj)
                    });
                    let update = await chatModel.findByIdAndUpdate({ _id: view._id }, { $set: { messageDetail: messageDetail, deleteChat1: deleteChat1, deleteChat2: deleteChat2 } }, { new: true });
                    if (update) {
                        return res.status(200).json({ status: 200, message: "Data found successfully.", data: update });
                    }
                }
            }
        }
        if (astroData == (null || undefined) && userData != (null || undefined)) {
            let view = await chatModel.findOne({ _id: req.query._id });
            if (!view) {
                return res.status(404).json({ status: 404, message: "Data not found.", data: {} });
            } else {
                let deleteChat1, deleteChat2;
                if ((userData._id).toString() == (view.userId).toString()) {
                    deleteChat1 = true
                    deleteChat2 = view.deleteChat2
                }
                if ((deleteChat1 == true) && (deleteChat2 == true)) {
                    let chatRes = await chatModel.findByIdAndDelete({ _id: view._id });
                    if (chatRes) {
                        response(res, SuccessCode.SUCCESS, view, SuccessMessage.DELETE_SUCCESS);
                    }
                }
                if ((deleteChat1 == true) && (deleteChat2 == false)) {
                    let messageDetail = [];
                    view.messageDetail.map(o => {
                        let messageClear1, messageClear2;
                        if ((userData._id).toString() == (view.userId).toString()) {
                            messageClear1 = true
                            messageClear2 = o.messageClear2
                        }
                        let obj = {
                            messageClear1: messageClear1,
                            messageClear2: messageClear2,
                            sender: o.sender,
                            userName: o.userName,
                            Type: o.Type,
                            message: o.message,
                            time: o.time,
                            messageStatus: o.messageStatus,
                            _id: o._id
                        }
                        messageDetail.push(obj)
                    });
                    let update = await chatModel.findByIdAndUpdate({ _id: view._id }, { $set: { messageDetail: messageDetail, deleteChat1: deleteChat1, deleteChat2: deleteChat2 } }, { new: true });
                    if (update) {
                        return res.status(200).json({ status: 200, message: "Data found successfully.", data: update });
                    }
                }
                if ((deleteChat1 == false) && (deleteChat2 == true)) {
                    let messageDetail = [];
                    view.messageDetail.map(o => {
                        let messageClear1, messageClear2;
                        if ((userData._id).toString() == (view.userId).toString()) {
                            messageClear1 = true
                            messageClear2 = o.messageClear2
                        }
                        let obj = {
                            messageClear1: messageClear1,
                            messageClear2: messageClear2,
                            sender: o.sender,
                            userName: o.userName,
                            Type: o.Type,
                            message: o.message,
                            time: o.time,
                            messageStatus: o.messageStatus,
                            _id: o._id
                        }
                        messageDetail.push(obj)
                    });
                    let update = await chatModel.findByIdAndUpdate({ _id: view._id }, { $set: { messageDetail: messageDetail, deleteChat1: deleteChat1, deleteChat2: deleteChat2 } }, { new: true });
                    if (update) {
                        return res.status(200).json({ status: 200, message: "Data found successfully.", data: update });
                    }
                }
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: 'Internal server error' });
    }
};
exports.clearChat = async (req, res) => {
    try {
        let userData = await userModel.findOne({ _id: req.body.userId });
        if (!userData) {
            return res.status(404).json({ status: 404, message: "User not found.", data: {} });
        }
        let astroData = await astrologer.findOne({ _id: req.body.userId });
        if (!astroData) {
            return res.status(404).json({ status: 404, message: "Data not found.", data: {} });
        }
        if (astroData != (null || undefined) && userData == (null || undefined)) {
            let view = await chatModel.findOne({ _id: req.query._id });
            if (!view) {
                return res.status(404).json({ status: 404, message: "Data not found.", data: {} });
            } else {
                let messageDetail = [];
                view.messageDetail.map(o => {
                    let messageClear1, messageClear2;
                    if ((astroData._id).toString() == (view.astroId).toString()) {
                        messageClear2 = true
                        messageClear1 = o.messageClear1
                    }
                    let obj = {
                        messageClear1: messageClear1,
                        messageClear2: messageClear2,
                        sender: o.sender,
                        userName: o.userName,
                        Type: o.Type,
                        message: o.message,
                        time: o.time,
                        messageStatus: o.messageStatus,
                        _id: o._id
                    }
                    messageDetail.push(obj)
                });
                let update = await chatModel.findByIdAndUpdate({ _id: view._id }, { $set: { messageDetail: messageDetail } }, { new: true });
                if (update) {
                    return res.status(200).json({ status: 200, message: "Data found successfully.", data: update });
                }
            }
        }
        if (astroData == (null || undefined) && userData != (null || undefined)) {
            let view = await chatModel.findOne({ _id: req.query._id });
            if (!view) {
                return res.status(404).json({ status: 404, message: "Data not found.", data: {} });
            } else {
                let messageDetail = [];
                view.messageDetail.map(o => {
                    let messageClear1, messageClear2;
                    if ((userData._id).toString() == (view.userId).toString()) {
                        messageClear1 = true
                        messageClear2 = o.messageClear2
                    }
                    let obj = {
                        messageClear1: messageClear1,
                        messageClear2: messageClear2,
                        sender: o.sender,
                        userName: o.userName,
                        Type: o.Type,
                        message: o.message,
                        time: o.time,
                        messageStatus: o.messageStatus,
                        _id: o._id
                    }
                    messageDetail.push(obj)
                });
                let update = await chatModel.findByIdAndUpdate({ _id: view._id }, { $set: { messageDetail: messageDetail } }, { new: true });
                if (update) {
                    return res.status(200).json({ status: 200, message: "Data found successfully.", data: update });
                }
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: 'Internal server error' });
    }
};
exports.deleteAllChat = async (req, res) => {
    try {
        let userData = await userModel.findOne({ _id: req.body.userId });
        if (!userData) {
            return res.status(404).json({ status: 404, message: "User not found.", data: {} });
        }
        let astroData = await astrologer.findOne({ _id: req.body.userId });
        if (!astroData) {
            return res.status(404).json({ status: 404, message: "Data not found.", data: {} });
        }
        if (astroData != (null || undefined) && userData == (null || undefined)) {
            let view = await chatModel.find({ $or: [{ astroId: astroData._id, deleteChat2: false }, { userId: userData._id, deleteChat1: false }] });
            if (view.length == 0) {
                return res.status(404).json({ status: 404, message: "Data not found.", data: {} });
            } else {
                for (let i = 0; i < view.length; i++) {
                    let count = 0;
                    let deleteChat1, deleteChat2;
                    if ((astroData._id).toString() == (view[i].astroId).toString()) {
                        deleteChat2 = true
                        deleteChat1 = view[i].deleteChat1
                    }
                    if ((deleteChat1 == true) && (deleteChat2 == true)) {
                        await chatModel.findByIdAndDelete({ _id: view[i]._id });
                        count++;
                    }
                    if ((deleteChat1 == true) && (deleteChat2 == false)) {
                        let messageDetail = [];
                        view[i].messageDetail.map(o => {
                            let messageClear1, messageClear2;
                            if ((astroData._id).toString() == (view[i].astroId).toString()) {
                                messageClear1 = o.messageClear1
                                messageClear2 = true
                            }
                            let obj = {
                                messageClear1: messageClear1,
                                messageClear2: messageClear2,
                                sender: o.sender,
                                userName: o.userName,
                                Type: o.Type,
                                message: o.message,
                                time: o.time,
                                messageStatus: o.messageStatus,
                                _id: o._id
                            }
                            messageDetail.push(obj)
                        });
                        let update = await chatModel.findByIdAndUpdate({ _id: view[i]._id }, { $set: { messageDetail: messageDetail, deleteChat1: deleteChat1, deleteChat2: deleteChat2 } }, { new: true });
                        count++;
                    }
                    if ((deleteChat1 == false) && (deleteChat2 == true)) {
                        let messageDetail = [];
                        view[i].messageDetail.map(o => {
                            let messageClear1, messageClear2;
                            if ((astroData._id).toString() == (view[i].astroId).toString()) {
                                messageClear1 = o.messageClear1
                                messageClear2 = true
                            }
                            let obj = {
                                messageClear1: messageClear1,
                                messageClear2: messageClear2,
                                sender: o.sender,
                                userName: o.userName,
                                Type: o.Type,
                                message: o.message,
                                time: o.time,
                                messageStatus: o.messageStatus,
                                _id: o._id
                            }
                            messageDetail.push(obj)
                        });
                        let update = await chatModel.findByIdAndUpdate({ _id: view[i]._id }, { $set: { messageDetail: messageDetail, deleteChat1: deleteChat1, deleteChat2: deleteChat2 } }, { new: true });
                        count++;
                    }
                    if (count == view.length) {
                        let view = await chatModel.find({ astroId: astroData._id, deleteChat2: true });
                        if (view.length == 0) {
                            return res.status(404).json({ status: 404, message: "Data not found.", data: {} });
                        } else {
                            return res.status(200).json({ status: 200, message: "Data found successfully.", data: view });
                        }
                    }
                }
            }
        }
        if (astroData == (null || undefined) && userData != (null || undefined)) {
            let view = await chatModel.find({ $or: [{ astroId: astroData._id, deleteChat2: false }, { userId: userData._id, deleteChat1: false }] });
            if (view.length == 0) {
                return res.status(404).json({ status: 404, message: "Data not found.", data: {} });
            } else {
                for (let i = 0; i < view.length; i++) {
                    let count = 0;
                    let deleteChat1, deleteChat2;
                    if ((userData._id).toString() == (view[i].userId).toString()) {
                        deleteChat1 = true
                        deleteChat2 = view[i].deleteChat2
                    }
                    if ((deleteChat1 == true) && (deleteChat2 == true)) {
                        await chatModel.findByIdAndDelete({ _id: view[i]._id });
                        count++;
                    }
                    if ((deleteChat1 == true) && (deleteChat2 == false)) {
                        let messageDetail = [];
                        view[i].messageDetail.map(o => {
                            let messageClear1, messageClear2;
                            if ((userData._id).toString() == (view[i].userId).toString()) {
                                messageClear1 = true
                                messageClear2 = o.messageClear2
                            }
                            let obj = {
                                messageClear1: messageClear1,
                                messageClear2: messageClear2,
                                sender: o.sender,
                                userName: o.userName,
                                Type: o.Type,
                                message: o.message,
                                time: o.time,
                                messageStatus: o.messageStatus,
                                _id: o._id
                            }
                            messageDetail.push(obj)
                        });
                        let update = await chatModel.findByIdAndUpdate({ _id: view[i]._id }, { $set: { messageDetail: messageDetail, deleteChat1: deleteChat1, deleteChat2: deleteChat2 } }, { new: true });
                        count++;
                    }
                    if ((deleteChat1 == false) && (deleteChat2 == true)) {
                        let messageDetail = [];
                        view[i].messageDetail.map(o => {
                            let messageClear1, messageClear2;
                            if ((userData._id).toString() == (view[i].userId).toString()) {
                                messageClear1 = true
                                messageClear2 = o.messageClear2
                            }
                            let obj = {
                                messageClear1: messageClear1,
                                messageClear2: messageClear2,
                                sender: o.sender,
                                userName: o.userName,
                                Type: o.Type,
                                message: o.message,
                                time: o.time,
                                messageStatus: o.messageStatus,
                                _id: o._id
                            }
                            messageDetail.push(obj)
                        });
                        let update = await chatModel.findByIdAndUpdate({ _id: view[i]._id }, { $set: { messageDetail: messageDetail, deleteChat1: deleteChat1, deleteChat2: deleteChat2 } }, { new: true });
                        count++;
                    }
                    if (count == view.length) {
                        let view = await chatModel.find({ userId: userData._id, deleteChat1: true });
                        if (view.length == 0) {
                            return res.status(404).json({ status: 404, message: "Data not found.", data: {} });
                        } else {
                            return res.status(200).json({ status: 200, message: "Data found successfully.", data: view });
                        }
                    }
                }
            }
        }
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Internal server error' });
    }
};
exports.deleteMessage = async (req, res) => {
    try {
        let userData = await userModel.findOne({ _id: req.body.userId });
        if (!userData) {
            return res.status(404).json({ status: 404, message: "User not found.", data: {} });
        }
        let astroData = await astrologer.findOne({ _id: req.body.userId });
        if (!astroData) {
            return res.status(404).json({ status: 404, message: "Data not found.", data: {} });
        }
        if (astroData != (null || undefined) && userData == (null || undefined)) {
            let view = await chatModel.findOne({ _id: req.params.id });
            if (!view) {
                return res.status(404).json({ status: 404, message: "Data not found.", data: {} });
            } else {
                let messageClear1, messageClear2;
                if ((astroData._id).toString() == (view[i].astroId).toString()) {
                    messageClear1 = false;
                    messageClear2 = true;
                }
                let update = await chatModel.findOneAndUpdate({ 'messageDetail._id': req.body.messageId }, { $set: { 'messageDetail.$.messageClear1': messageClear1, 'messageDetail.$.messageClear2': messageClear2 } }, { new: true })
                if (update) {
                    return res.status(200).json({ status: 200, message: "Message delete successfully.", data: update });
                }
            }
        }
        if (astroData == (null || undefined) && userData != (null || undefined)) {
            let view = await chatModel.findOne({ _id: req.params.id });
            if (!view) {
                return res.status(404).json({ status: 404, message: "Data not found.", data: {} });
            } else {
                let messageClear1, messageClear2;
                if ((userData._id).toString() == (view[i].userId).toString()) {
                    messageClear1 = true;
                    messageClear2 = false;
                }
                let update = await chatModel.findOneAndUpdate({ 'messageDetail._id': req.body.messageId }, { $set: { 'messageDetail.$.messageClear1': messageClear1, 'messageDetail.$.messageClear2': messageClear2 } }, { new: true })
                if (update) {
                    return res.status(200).json({ status: 200, message: "Message delete successfully.", data: update });
                }
            }
        }


    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: 'Internal server error' });
    }
};