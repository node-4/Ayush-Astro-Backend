const bookidgen = require("bookidgen");
// const Banner = require('../models/Banner')
const moment = require("moment");
// const product = require('../models/product')
const { encrypt, compare } = require("../services/crypto");
const User = require("../models/User");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
const jwt = require("jsonwebtoken");
const JWTkey = "rubi";
const bcrypt = require("bcrypt");
const Admin = require("../models/Admin");
const blog = require("../models/blog");
const feedback = require("../models/feedback");
const fees = require('../models/fees_Models')
const astrologer = require('../models/astrologer');


const sendSMS = async (to, otp) => {
  const from = "+19287568632";
  await client.messages
    .create({
      body: otp,
      from: from,
      to: to,
    })
    .then((message) => {
      console.log(message.sid);
      return message;
    });
};

//SignUP
exports.signUpUser = async (req, res) => {
  const { email, mobile_Number, password, user_Name } = req.body;

  // Check if user already exist
  const Existing = await Admin.findOne({ mobile_Number });
  if (Existing) {
    return res.send("Already existing");
  }
  encryptedPassword = await bcrypt.hash(password, 10);

  // create new user
  const newUser = await createUser(email, mobile_Number, password, user_Name);
  if (!newUser[0]) {
    return res.status(400).send({
      message: "Unable to create new user",
    });
  }
  res.send(newUser);
};

const createUser = async (email, mobile_Number, password, user_Name) => {
  const hashedPassword = await encrypt(password);
  const otpGenerated = Math.floor(1000 + Math.random() * 90000);
  const newUser = await Admin.create({
    email,
    user_Name,
    mobile_Number,
    password: hashedPassword,
    otp: otpGenerated,
  });
  if (!newUser) {
    return [false, "Unable to sign you up"];
  }
  try {
    // sendSMS(`+91${mobile_Number}`, otpGenerated)

    return [true, newUser];
  } catch (error) {
    return [false, "Unable to sign up, Please try again later", error];
  }
};

//login ------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      res.status(400).send("All input is required");
    }

    const user = await Admin.findOne({ email });

    if (!user)
      res.status(400).json({
        message: "This Number is not registered",
      });

    if (user && (await compare(password, user.password))) {
      jwt.sign(
        { user_id: user._id },
        JWTkey,
        { expiresIn: "3h" },
        (err, token) => {
          if (err) res.status(400).send("Invalid Credentials");
          res.send({ user, token });
        }
      );
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: err.message
    })
  }
};

//blog post api

exports.postuserBlogs = async (req, res) => {
  let photo = req.body;
  photo["blog_Images"] = [req.file.originalname];
  let { Date, User_Name, sub_Title, Intro, blog_Images } = photo;

  try {
    if (!(Date && User_Name && sub_Title && Intro && blog_Images)) {
      res
        .status(400)
        .json({ message: "All fields are required", status: false });
    } else {
      const getResponce = await blog.create({
        User_Name,
        Date,
        sub_Title,
        Intro,
        blog_Images,
      });

      if (!getResponce) {
        res
          .status(400)
          .json({ message: "User Blogs  is not created", status: false });
      } else {
        res.status(200).json({
          message: "User Bloges is created successfully",
          data: getResponce,
          status: true,
        });
      }
    }
  } catch (error) {
    res.status(400).json({ message: error.message, status: false });
  }
};

//get api

exports.ViewDataBlogs = async (req, res) => {
  try {
    const getBlogs = await blog.findById(req.params.id);
    if (!getBlogs) {
      res.status(400).json({ message: "Enter the correct id", status: false });
    } else {
      res.status(200).json({
        message: "User Bolgs is Created successfully",
        data: getBlogs,
        status: true,
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message, status: false });
  }
};

//upadte

exports.UpdateBlogs = async (req, res) => {
  let photo = req.body;
  photo["blog_Images"] = [req.file.originalname];
  let { Date, User_Name, sub_Title, Intro, blog_Images } = req.body;

  try {
    if (!(Date && User_Name && sub_Title && Intro && blog_Images)) {
      res.json({ message: "All fields are required", status: false });
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
  } catch { }
};

//delete
exports.RemovedBlogs = async (req, res) => {
  try {
    const deleteBlogs = await blog.findOneAndDelete({ id: req.params.id });
    if (!deleteBlogs) {
      res.status(400).json({ message: "Enter the correct id", status: false });
    } else {
      res
        .status(200)
        .json({ message: " Blogs is deleted successfully", status: true });
    }
  } catch (error) {
    res.send({ message: error.message, status: false });
  }
};

// Feedback-----
exports.UserFeedback = async (req, res) => {
  let { UserId,  Feedback } = req.body;

  try {
    if (!(UserId && Feedback)) {
      res
        .status(400)
        .json({ message: "All fields are required", status: false });
    } else {
      const userData = await User.findById({_id: UserId});
      const data = {
        UserId: UserId, 
        Feedback: Feedback, 
        name: userData.firstName
      }
      const NewUserFeedback = await feedback.create(data);
      if (NewUserFeedback)
        res
          .status(200)
          .json({
            message: "UserFeedback Send",
            data: NewUserFeedback,
            status: true,
          });
      res
        .status(400)
        .json({ message: "UserFeedback  not send", status: false });
    }
  } catch (error) {
    res.status(400).json({ message: error.message, status: false });
  }
};

//get all feedback

exports.ViewAllFeedback = async (req, res) => {
  try {
    const SendFeedback = await feedback.find();
    res
      .status(200)
      .json({
        message: "See All Feedback",
        Feedback: SendFeedback,
        status: true,
      });
  } catch (error) {
    console.log(error);
  }
};

// Added Astro Fees By Admin 
exports.AddChargesofAstro = async (req, res) => {
  try {
    const data = {
      astroId: req.params.astroId,
      fees: req.body.fees
    }

    await astrologer.findByIdAndUpdate({_id: req.params.id},{
      fees:[req.body.fees]
    })
    const Data = await fees.create(data);
    res.status(200).json({
      details: Data
    })
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: err.message
    })
  }
}


exports.GetAllFessDetails = async (req, res) => {
  try {
    const data = await fees.find();
    res.status(200).json({
      details: data
    })
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message })
  }
}

exports.GetFeesByAstroId = async (req, res) => {
  try {
    const data = await fees.find({ astroId: req.params.id });
    res.status(200).json({
      details: data
    })
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: err.message
    })
  }
}


exports.UpdateFees = async (req, res) => {
  try {
    await fees.updateOne({ astroId: req.params.id }, {
      fees: req.body.fees
    })
    res.status(200).json({
      message: "Fees Data is Updatd "
    })
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: err.message
    })
  }
}

exports.DeleteFeedetails = async (req, res) => {
  try {
    await fees.deleteOne({ astroId: req.params.id })
    res.status(200).json({
      message: "Astro Fees Data is Deleted "
    })
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message })
  }
}


exports.allAstro = async (req, res) => {
  try {
    const users = await astrologer.find();
    res.status(200).json({
      details: users, 
    })
  } catch (err) {
    res.status(400).json({
      message: err.message
    })
  }
}