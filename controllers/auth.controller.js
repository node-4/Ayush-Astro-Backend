const User = require("../models/User");
const { encrypt, compare } = require("../services/crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWTkey = "rubi";
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const otp = require("../services/OTP");
const blog = require("../models/blog");
const dotenv = require("dotenv");
const wallet = require("../models/wallet");
const otpGenerator = require("otp-generator");
const review = require("../models/review");
const astrologer = require("../models/astrologer");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const authPhone = process.env.TWILIO_ACCOUNT_PHONE;
const client = require("twilio")(accountSid, authToken, {
    lazyLoading: true,
});
dotenv.config({ path: "../.env" });
// const { status } = require('express/lib/response');

const generateJwtToken = (id) => {
    return jwt.sign({ id }, JWTkey, {
        expiresIn: "7d",
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = generateJwtToken(user._id.toString());
    // console.log("token", token);
    // console.log(process.env.JWT_COOKIE_EXPIRES_IN);
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };

    if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

    res.cookie("jwt", token, cookieOptions);
    // console.log("After cookie");

    res.status(statusCode).json({
        status: "success",
        token,
        data: {
            user,
        },
    });
};

exports.sendOTP = async (req, res,) => {
    const otp = otpGenerator.generate(4, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
    });
    await client.messages
        .create({
            body: `The otp send to your mobile in ${otp}`,
            from: "",
            to: `+91${req.body.mobile}`,
            channel: "sms",
        })
        .then((data) => {
            res.status(200).send(data);
            console.log("sent OTP!");
        })
        .catch((err) => {
            console.log(err);
            return next(new AppError(`Couldn't send OTP`, 401));
        });
};

exports.verifyOTP = async (req, res) => {
    try {
        const data = await User.findOne({ otp: req.body.otp });
        if (!data) {
            return res.status(401).json({
                message: "Your Otp is Wrong",
            });
        } else {
            res.status(400).json({
                message: "Login Done ",
            });
        }
    } catch (err) {
        res.status(400).json({
            message: err.message,
        });
    }
};
// exports.verifyOTP = async (req, res) => {
//   await client.verify.v2.verificationChecks.create({
//       to: `+91${req.body.mobile}`,
//       code: req.body.otp,
//     })
//     .then((data) => {
//       res.status(200).send({
//         status: data.status,
//       });
//       console.log("verified! 👍");
//     })
//     .catch((err) => {
//       res.status(401).json({
//         message: "Wrong OTP entered!",
//       });
//       console.log("wrong OTP !!");
//     });
// };

exports.verifyOTPSignedIn = async (req, res, next) => {
    const user = await User.findOne({ mobile: req.body.mobile });
    console.log(user);
    await client.verify
        .services(verifySid)
        .verificationChecks.create({
            to: `+91${req.body.mobile}`,
            code: req.body.otp,
        })
        .then((data) => {
            createSendToken(user, 201, res);
            console.log("verified! 👍", data);
        })
        .catch((err) => {
            console.log("wrong OTP !!", err);
            res.status(401).json({
                status: "Failed",
                message: err.message,
            });
        });
};

// SignIn
module.exports.login = async (req, res) => {
    try {
        const { mobile, password } = req.body;
        console.log(mobile);
        console.log(password);
        if (!(mobile && password)) {
            res.status(403).send({ message: "All input is required", status: 403 });
        }
        const user = await User.findOne({ mobile });
        console.log(user);
        if (!user)
            res.status(402).json({ message: "This Number is not registered", status: 402 });
        const isPassword = await compare(password, user.password);
        if (isPassword) {
            jwt.sign({ user_id: user._id }, JWTkey, (err, token) => {
                if (err)
                    return res.status(401).send({ message: "Invalid Credentials", status: 401 });
                console.log(token);
                return res.status(200).send({ user, token });
            });
        } else {
            res.status(401).send({ message: "Invalid Credentials", status: 401, });
        }
    } catch (err) {
        console.log(err);
        //   res.status(400).json({message: err.message})
    }
};

exports.send;
exports.protect = catchAsync(async (req, res, next) => {
    // 1) Getting Token & check if its there!
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {
        return next(
            new AppError(
                "You are not logged in!, please login to get access!",
                401
            )
        );
    }

    // 2) Verification of Token
    const decoded = await promisify(jwt.verify)(token, JWTkey);

    // 3) Check if user still exists.
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
        return next(
            new AppError(
                "The user belonging to this token no  longer Exists!",
                401
            )
        );
    }

    req.user = currentUser;
    res.locals.user = currentUser;
    next();
});

exports.isAuthenticated = async (req, res, next) => {
    console.log(req.headers.authorization);
    if (req.headers.authorization) {
        console.log("entered authorization");
        const token = req.headers.authorization.split(" ")[1];
        const user = jwt.verify(token, JWTkey);
        req.user = user.id || user.user_id;
        next();
    } else {
        return res.status(401).json({ message: "Authorization required" });
    }
};

exports.userMiddleware = async (req, res, next) => {
    console.log(req.user);
    const user = await User.findById(req.user);
    if (!user) {
        return res.status(404).json({
            status: "failed",
            message: "Please login to get access",
        });
    } else {
        next();
    }
};

// Verify

module.exports.signUpUser = async (req, res) => {
    const { firstName, lastName, dob, password, confirmpassword, address, email, mobile, country, state, district, pincode, language, rashi, desc, skills, link, } = req.body;
    if (!firstName && !lastName && !email && !password && !confirmpassword) {
        return res.status(501).json({ message: "All field are required" });
    }
    const Existing = await User.findOne({ mobile });
    if (Existing) {
        return res.status(409).json({ message: "Already existing " });
    }
    if (password !== confirmpassword) {
        return res.status(401).json({ message: "Password is not match " });
    }
    encryptedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser(firstName, lastName, dob, password, confirmpassword, address, email, mobile, country, state, district, pincode, language, rashi, desc, skills, link);
    if (!newUser[0]) {
        return res.status(400).send({ message: "Unable to create new user" });
    }
    res.send({ otp: newUser });
};

const createUser = async (firstName, lastName, dob, password, confirmpassword, address, email, mobile, country, state, district, pincode, language, rashi, desc, skills, link) => {
    const hashedPassword = await encrypt(password);
    const confirmPassword = await encrypt(confirmpassword);
    const otpGenerated = otpGenerator.generate(4, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false, });
    const newUser = await User.create({ firstName, lastName, dob, address, email, mobile, country, state, district, pincode, language, rashi, desc, skills, link, password: hashedPassword, confirmpassword: confirmPassword, otp: otpGenerated, });
    if (!newUser) { return [false, "Unable to sign you up"]; }
    try {
        // let b = await sendSMS(`+91${mobile}`, otpGenerated);
        // if (b) {
        return newUser.otp;
        // }
    } catch (error) {
        return [false, "Unable to sign up, Please try again later", error];
    }
};
const sendSMS = async (phone, message) => {
    try {
        const response = await client.messages.create({
            body: message,
            from: authPhone,
            to: phone,
        });
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
};
exports.logout = (req, res) => {
    res.cookie("jwt", "loggedout", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.status(200).json({ status: "success" });
};

//patch api
module.exports.updateUserProfile = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            password,
            confirmpassword,
            address,
            email,
            mobile,
            country,
            state,
            district,
            pincode,
            language,
            rashi,
            desc,
            skills,
        } = req.body;
        await User.findByIdAndUpdate(
            { _id: req.body.id },
            {
                firstName,
                lastName,
                password,
                confirmpassword,
                address,
                email,
                mobile,
                country,
                state,
                district,
                pincode,
                language,
                rashi,
                desc,
                skills,
            }
        );
        res.status(200).json({
            message: "Update is successfull",
            status: true,
            UpdateUser,
        });
    } catch (err) {
        res.status(400).json({
            message: "Update is successfull",
            status: false,
        });
    }
};

// /get api

module.exports.GetUserProfiles = async (req, res, next) => {
    // console.log(req.user);
    try {
        const UpdateUser = await User.findById(req.params.id);
        return res.status(200).json({
            success: true,
            msg: "UpdateUser",
            UpdateUser: UpdateUser,
        });
    } catch (error) {
        next(error);
    }
};

//post for blog user

module.exports.postuserBlogs = async (req, res) => {
    let photo = req.body;
    photo["blog_Images"] = [req.file.originalname];
    let { Date, User_Name, sub_Title, Intro, blog_Images } = photo;

    try {
        if (!(Date && User_Name && sub_Title && Intro && blog_Images)) {
            res.status(400).json({
                message: "All fields are required",
                status: false,
            });
        } else {
            const getResponce = await blog.create({
                User_Name,
                Date,
                sub_Title,
                Intro,
                blog_Images,
            });

            if (!getResponce) {
                res.status(400).json({
                    message: "User Blogs  is not created",
                    status: false,
                });
            } else {
                res.status(200).json({
                    message: "User Blog is created successfully",
                    data: getResponce,
                    status: true,
                });
            }
        }
    } catch (error) {
        res.status(400).json({ message: error.message, status: false });
    }
};

//update blog for user

module.exports.UpdateBlogs = async (req, res) => {
    let photo = req.body;
    photo["blog_Images"] = [req.file.originalname];
    // console.log(photo);
    let { Date, User_Name, sub_Title, Intro, blog_Images } = photo;

    if (!(Date && User_Name && sub_Title && Intro && blog_Images)) {
        res.status(400).json({
            message: "All fields are required",
            status: false,
        });
    } else {
        const updatedBlogs = await blog.findByIdAndUpdate(
            { _id: req.params.id },
            {
                User_Name,
                Date,
                sub_Title,
                Intro,
                blog_Images,
            }
        );
        if (!updatedBlogs) {
            res.send("Unable to update Blogs");
        }
        res.send(updatedBlogs);
    }
};
//
exports.loginWithOTP = async (req, res) => {
    try {
        if (!req.body.mobile) {
            return res
                .status(400)
                .send({ message: "phone number is required" });
        }
        const otp = otpGenerator.generate(4, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false, });
        req.body.otpExpiration = Date.now() + (1000 * 60 * 5);
        const userRegistered = await User.findOne({ mobile: req.body.mobile });
        if (!userRegistered) {
            req.body.otp = otp;
            let b = await sendSMS(`+91${req.body.mobile}`, otp);
            if (b) {
                const user = await User.create(req.body);
                return res
                    .status(200)
                    .send({ userId: user._id, otp: otp, message: "otp sent" });
            }
        } else {
            userRegistered.otp = otp;
            userRegistered.accountVerification = false;
            // let b = await sendSMS(`+91${req.body.mobile}`, otp);
            // if (b) {
            await userRegistered.save();
            return res.status(200).send({
                userId: userRegistered._id,
                otp: otp,
                message: "otp sent",
            });
            // }
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send({ status: 500, message: "Internal server error" });
    }
};

exports.verifyloginOTP = async (req, res) => {
    const { otp } = req.body;
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        if (otp !== user.otp) {
            return res.status(404).send({ message: "Invalid OTP" });
        }
        user.accountVerification = true;
        await user.save();
        jwt.sign({ user_id: user._id }, JWTkey, (err, token) => {
            if (err) {
                return res.status(401).send({ message: "Invalid Credentials" });
            } else {
                return res.status(200).send({ status: 200, message: "OTP verified successfully", userId: user._id, token: token, });
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ status: 500, message: "Internal server error" });
    }
};
exports.socialLogin = async (req, res) => {
    try {
        const { firstName, lastName, email, mobile } = req.body;
        console.log(req.body);
        const user = await User.findOne({ firstName, lastName, email, mobile });
        console.log(user);
        if (user) {
            jwt.sign({ user_id: user._id }, JWTkey, (err, token) => {
                if (err) {
                    return res.status(401).send("Invalid Credentials");
                } else {
                    return res.status(200).json({ status: 200, msg: "Login successfully", userId: user._id, token: token, });
                }
            });
        } else {
            const newUser = await User.create({ firstName, lastName, mobile, email });
            if (newUser) {
                jwt.sign({ user_id: newUser._id }, JWTkey, (err, token) => {
                    if (err) {
                        return res.status(401).send("Invalid Credentials");
                    } else {
                        return res.status(200).json({ status: 200, msg: "Login successfully", userId: user._id, token: token, });
                    }
                });
            }
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send({ status: 500, message: "Internal server error" });
    }
};

module.exports.updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, mobile, dob } = req.body;
        let id = req.user
        console.log("-----------------------", id);
        let findUser = await User.findOne({ _id: id });
        if (!findUser) {
            res.status(404).json({ message: "User id not found.", status: false });
        } else {
            let image;
            if (req.file) {
                image = req.file.path
            }
            let obj = {
                firstName: firstName || findUser.firstName,
                lastName: lastName || findUser.lastName,
                image: image || findUser.image,
                mobile: mobile || findUser.mobile,
                dob: dob || findUser.dob,
            }
            let UpdateUser = await User.findByIdAndUpdate({ _id: findUser._id }, { $set: obj }, { new: true });
            res.status(200).json({ message: "Update is successfull", status: true, UpdateUser, });
        }
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: "Update is successfull", status: false, });
    }
};


exports.AddReview = async (req, res) => {
    try {
        const data = {
            user: req.user,
            astroId: req.body.astroId,
            rating: parseInt(req.body.rating),
            comment: req.body.comment
        }
        const result = await review.create(data)
        const Review = await review.findById(result._id).populate('user astroId');

        res.status(200).json({ status: 200, message: "Review is Added ", data: Review })
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ msg: "internal server error ", error: err.message });
    }
}
exports.getAllReview = async (req, res) => {
    try {
        const data = await review.find().populate('user astroId')
        res.status(200).json({
            message: "ok",
            data: data
        })
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ msg: "internal server error ", error: err.message });
    }
}
exports.getAllbyToken = async (req, res) => {
    try {
        const data = await review.find({ user: req.user }).populate('astroId').populate("user")
        res.status(200).json({
            message: "ok",
            data: data
        })
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ msg: "internal server error ", error: err.message });
    }
}
exports.getReviewById = async (req, res) => {
    try {
        const Review = await review.findById(req.params.id);
        res.status(200).json({ message: "ok", data: Review })
    } catch (error) {
        console.error('Error getting review by ID:', error);
    }
};
exports.updateReview = async (req, res) => {
    try {
        const Review = await review.findById(req.params.id);

        const obj = {
            user: req.user,
            astroId: req.body.astroId || Review.astroId,
            rating: parseInt(req.body.rating) || Review.rating,
            comment: req.body.comment || Review.comment,
        }
        const update = await review.findByIdAndUpdate(req.params.id, obj, { new: true, });
        res.status(200).json({ message: "ok", data: update })
    } catch (error) {
        console.error('Error updating review:', error);
    }
};
exports.deleteReview = async (req, res) => {
    try {
        const Review = await review.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "ok", data: Review })
    } catch (error) {
        console.error('Error deleting review:', error);
    }
};

