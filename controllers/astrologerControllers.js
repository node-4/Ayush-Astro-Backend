const bookidgen = require("bookidgen");
// const Banner = require('../models/Banner')
const moment = require("moment");
// const product = require('../models/product')
const { encrypt, compare } = require("../services/crypto");
const verifySid = "VA84bc752a91abcf7df9f31c76832bafff";
const User = require("../models/User");
const Blog = require('../models/blog')
const jwt = require("jsonwebtoken");
const JWTkey = "rubi";
const bcrypt = require("bcrypt");
const astrologer = require('../models/astrologer');
const fees = require("../models/fees_Models");
const review = require('../models/review');
const feedback = require("../models/feedback");
var newOTP = require("otp-generators");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const authPhone = process.env.TWILIO_ACCOUNT_PHONE;
const client = require("twilio")(accountSid, authToken, {
  lazyLoading: true,
});

const sendSMS = async (phone, message) => {
  try {
    console.log("31------------");
    const response = await client.messages.create({
      body: message,
      from: authPhone,
      to: phone,
    });
    return response;
  } catch (error) {
    console.log("39==================", error);
    return message;
    console.log(error);
    throw error;
  }
}

exports.sendOTP = async (req, res) => {

};

// exports.verifyOTP = async (req, res) => {
//   await client.verify.v2
//     .services(verifySid)
//     .verificationChecks.create({
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

exports.signUpUser = async (req, res) => {
  const { firstName, lastName, password, confirmpassword, address, email, mobile, country, state, district, pincode, language, rashi, desc, skills, specification, fees, rating, link, aboutMe, gender, dailyhoures, experience } = req.body;
  console.log(req.body)

  // Check if user already exist
  const Existing = await astrologer.findOne({ mobile });
  if (Existing) {
    return res.status(402).send("Already existing");
  }
  if (password !== confirmpassword) {
    res.status(401).json({ message: "Password is not match " })
  }
  encryptedPassword = await bcrypt.hash(password, 10);
  const newUser = await createUser(firstName, lastName, password, confirmpassword, address, email, mobile, country, state, district, pincode, language, rashi, desc, skills, specification, fees, rating, link, aboutMe, gender, dailyhoures, experience);
  if (!newUser[0]) {
    return res.status(400).send({ message: "Unable to create new user", });
  }
  res.send({ otp: newUser });
};

const createUser = async (firstName, lastName, password, confirmpassword, address, email, mobile, country, state, district, pincode, language, rashi, desc, skills, specification, fees, rating, link, aboutMe, gender, dailyhoures, experience) => {
  try {
    const hashedPassword = await encrypt(password);
    const confirmPassword = await encrypt(confirmpassword)
    const otpGenerated =  newOTP.generate(4, { alphabets: false, upperCase: false, specialChar: false, });
    const newUser = await astrologer.create({ firstName, lastName, address, email, mobile, country, state, district, pincode, language, rashi, desc, skills, specification, fees, rating, link, aboutMe, gender, password: hashedPassword, confirmpassword: confirmPassword, otp: otpGenerated, dailyhoures: parseInt(dailyhoures), experience: parseInt(experience) });
    if (!newUser) {
      return [false, "Unable to sign you up"];
    } else {
      let b = await sendSMS(`+91${mobile}`, otpGenerated);
      if (b) {
        return newUser.otp;
      } else {
        return newUser.otp;
      }
    }
  } catch (error) {
    return [false, "Unable to sign up, Please try again later", error];
  }
};


exports.verifyOTP = async (req, res) => {
  try {
    const data = await astrologer.findOne({ otp: req.body.otp });
    if (!data) {
      return res.status(401).json({
        message: "Your Otp is Wrong"
      })
    } else {
      res.status(400).json({
        message: "Otp verify"
      })
    }
  } catch (err) {
    res.status(400).json({
      message: err.message
    })
  }
}
// SignIn 
exports.login = async (req, res) => {
  try {
    const { mobile, password } = req.body;

    if (!(mobile && password)) {
      res.status(400).send("All input is required");
    }

    const user = await astrologer.findOne({ mobile });

    if (!user)
      res.status(400).json({
        message: "This Number is not registered",
      });
    const isPassword = await compare(password, user.password)
    if (isPassword) {
      jwt.sign(
        { user_id: user._id },
        JWTkey,
        (err, token) => {
          if (err) res.status(400).send("Invalid Credentials");
          res.status(200).send({ user, token });
        }
      );
    }
  } catch (err) {
    console.log(err);
  }
};


exports.ViewDataProfiles = async (req, res) => {
  try {
    const getDetails = await astrologer.findById(req.params.id);
    if (!getDetails) {
      res.status(400).json({ message: "Enter the correct id", status: false });
    } else {
      res.status(200).json({
        message: "User Details is Created successfully",
        data: getDetails,
        status: true,
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message, status: false });
  }
};

exports.SearchAstroNameLangSkills = async (req, res) => {
  const search = req.params.key;
  try {
    const student = await astrologer.find({
      $or: [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { Skills: { $regex: search, $options: "i" } },
        { Languages: { $regex: search, $options: "i" } },
      ],
    });
    if (student.length == 0) {
      res.json({ message: "Data is not Found", status: false });
    } else {
      res.json({
        message: " Data  is found Successfully",
        student: student,
        status: true,
      });
    }
  } catch (error) {
    res.json({ message: error.message, status: false });
  }
};


exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json({
      status: "success",
      data: blogs,
    });
  } catch (err) {
    res.status(400).json({
      status: "failure",
      message: err.message,
    });
  }
};

//Delete User--
exports.deleteAstroName = async (req, res) => {
  try {
    const DeleteUser = await astrologer.findByIdAndDelete({
      _id: req.params.id
    });
    if (!DeleteUser) {
      res.json({ message: "Enter the corret User  Name", status: false });
    } else {
      res
        .status(200)
        .json({ message: "User removed successfully", status: true });
    }
  } catch (error) {
    res.status(400).json({ message: error.message, status: false });
  }
};


exports.deleteLanguages = async (req, res) => {
  try {
    const DeleteUser = await astrologer.findOneAndDelete({
      $or: [{ Languages: { $regex: search, $options: "i" } }],
    });
    if (!DeleteUser) {
      res.json({ message: "Enter the corret User Languages", status: false });
    } else {
      res
        .status(200)
        .json({ message: "Languages removed successfully", status: true });
    }
  } catch (error) {
    res.status(400).json({ message: error.message, status: false });
  }
};

exports.GetAllAstro = async (req, res) => {
  try {
    console.log("---------54665--");
    // const users = await astrologer.find();
    const astro = await astrologer.find()

    console.log(astro);

    res.status(200).json({
      status: "success",
      data: astro
    });
  } catch (err) {
    res.status(400).json({
      status: "failure",
      message: err.message,
    });
  }
}


exports.updateAstro = async (req, res) => {
  try {
    const { firstName, lastName, password, confirmpassword, address, email, mobile, country, state, district, pincode, language, rashi, desc, skills, specification, fees, rating, aboutMe } = req.body;
    await astrologer.findByIdAndUpdate({ _id: req.params.id }, {
      firstName, lastName, password, confirmpassword, address, email, mobile, country, state, district, pincode, language, rashi, desc, skills, specification, fees, rating, aboutMe,
    })
    res.status(200).json({
      message: "Updated "
    })
  } catch (err) {
    console.log(err);
    res.state(400).json({
      err: err.message
    })
  }
}

