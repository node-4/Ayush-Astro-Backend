const order = require('../models/order');
const user = require('../models/User');
const astro = require('../models/astrologer')


exports.CreateOrder = async (req, res) => {
    try {
        const userId = req.body.userId;
        const astroId = req.body.astroId;
        const astroData = await astro.findById({ _id: astroId });
        const userData = await user.findById({ _id: userId });
        console.log(astroData)
        const data = {
            astroName: astroData.firstName,
            user: userId,
            astroId: req.body.astroId,
            type: req.body.type,
            time: req.body.time,
            name: userData.firstName + " " + userData.lastName,
            problem: req.body.problem,
            language: userData.language,
            rashi: userData.rashi
        }
        console.log(data)
        const orderData = await order.create(data);
        console.log(orderData);
        res.status(200).json({
            details: orderData
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({ message: err.message })
    }

}


exports.GetAllOrder = async (req, res) => {
    try {
        const orderData = await order.find();
        res.status(200).json({
            details: orderData
        })
    } catch (err) {
        console.log(err);
        res.status(400).json({
            message: err.message
        })
    }
}
exports.GetByOrderUserId = async (req, res) => {
    try {
        const { fromDate, toDate, page, limit } = req.query;
        let query = { user: req.params.id };
        if (fromDate && !toDate) {
            query.createdAt = { $gte: fromDate };
        }
        if (!fromDate && toDate) {
            query.createdAt = { $lte: toDate };
        }
        if (fromDate && toDate) {
            query.$and = [
                { createdAt: { $gte: fromDate } },
                { createdAt: { $lte: toDate } },
            ]
        }
        let options = {
            page: Number(page),
            limit: Number(limit) || 10,
            sort: { createdAt: -1 },
        };
        let data = await order.paginate(query, options);
        return res.status(200).json({ status: 200, message: "data found.", details: data });

    } catch (err) {
        return res.status(500).send({ msg: "internal server error ", error: err.message, });
    }
};

// exports.GetByOrderUserId = async (req, res) => {
//     try {
//         const data = await order.find({ user: req.params.id })
//         res.status(200).json({
//             details: data
//         })
//     } catch (err) {
//         res.status(400).json({
//             message: err.message
//         })
//     }
// }

exports.GetVyID = async (req, res) => {
    try {
        const data = await order.findById({ _id: req.params.id });
        res.status(200).json({
            details: data
        })
    } catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
}


exports.updateOrder = async (req, res) => {
    try {
        await order.findByIdAndUpdate({ _id: req.params.id }, {
            time: req.body.time,
            problem: req.body.problem,
        });
        res.status(200).json({ message: "Order Updated" })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}



exports.DeleteOrder = async (req, res) => {
    try {
        await order.findByIdAndDelete({ _id: req.params.id });
        res.status(200).json({ message: "Deleted  Updated" })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

exports.GetByAstroId = async (req, res) => {
    try {
        const { fromDate, toDate, page, limit } = req.query;
        let query = { astroId: req.params.id };
        if (fromDate && !toDate) {
            query.createdAt = { $gte: fromDate };
        }
        if (!fromDate && toDate) {
            query.createdAt = { $lte: toDate };
        }
        if (fromDate && toDate) {
            query.$and = [
                { createdAt: { $gte: fromDate } },
                { createdAt: { $lte: toDate } },
            ]
        }
        let options = {
            page: Number(page),
            limit: Number(limit) || 10,
            sort: { createdAt: -1 },
        };
        let data = await order.paginate(query, options);
        return res.status(200).json({ status: 200, message: "astrologer data found.", details: data });

    } catch (err) {
        return res.status(500).send({ msg: "internal server error ", error: err.message, });
    }
};

// exports.GetByAstroId = async (req, res) => {
//     try {
//         const data = await order.find({ astroId: req.params.id }).sort({ timestamp: -1 })
//         res.status(200).json({
//             details: data
//         })
//     } catch (err) {
//         res.status(400).json({
//             message: err.message
//         })
//     }
// }
